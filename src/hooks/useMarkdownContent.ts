import { useState, useEffect } from 'react';
import { loadTutorials, loadProducts, loadVideos } from '../utils/markdownLoader';
import { Tutorial, Product, Video } from '../types';

export const useTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        const data = await loadTutorials();
        setTutorials(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des tutoriels');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  return { tutorials, loading, error };
};

export const useTutorial = (slug: string) => {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        setLoading(true);
        const tutorials = await loadTutorials();
        const found = tutorials.find(t => t.slug === slug);
        setTutorial(found || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du tutoriel');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [slug]);

  return { tutorial, loading, error };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await loadProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const useProduct = (slug: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await loadProducts();
        const found = products.find(p => p.slug === slug);
        setProduct(found || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await loadVideos();
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des vidéos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};