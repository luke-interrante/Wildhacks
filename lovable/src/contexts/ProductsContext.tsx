
import React, { createContext, useContext, useState } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  category: string;
  sellerId: string;
  sellerName: string;
  available: boolean;
  organic: boolean;
  inSeason: boolean;
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getSellerProducts: (sellerId: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

// Mock products data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Organic Strawberries",
    description: "Sweet, juicy organic strawberries freshly picked from our farm.",
    price: 5.99,
    unit: "basket",
    imageUrl: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&q=80&w=1000",
    category: "fruits",
    sellerId: "2",
    sellerName: "Green Valley Farm",
    available: true,
    organic: true,
    inSeason: true,
  },
  {
    id: "2",
    name: "Farm Fresh Eggs",
    description: "Free-range eggs from our pasture-raised chickens.",
    price: 6.50,
    unit: "dozen",
    imageUrl: "https://images.unsplash.com/photo-1598965402089-897c5de12292?auto=format&fit=crop&q=80&w=1000",
    category: "dairy",
    sellerId: "2",
    sellerName: "Green Valley Farm",
    available: true,
    organic: true,
    inSeason: true,
  },
  {
    id: "3",
    name: "Heirloom Tomatoes",
    description: "Variety pack of our best heirloom tomatoes of the season.",
    price: 4.99,
    unit: "lb",
    imageUrl: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&q=80&w=1000",
    category: "vegetables",
    sellerId: "3",
    sellerName: "Sunshine Organics",
    available: true,
    organic: true,
    inSeason: true,
  },
  {
    id: "4",
    name: "Wildflower Honey",
    description: "Raw, unfiltered honey from our local beehives.",
    price: 12.99,
    unit: "jar",
    imageUrl: "https://images.unsplash.com/photo-1592403878406-92596b5aaa13?auto=format&fit=crop&q=80&w=1000",
    category: "specialty",
    sellerId: "4",
    sellerName: "Meadow Farm",
    available: true,
    organic: true,
    inSeason: true,
  },
  {
    id: "5",
    name: "Fresh Kale",
    description: "Crisp, nutrient-rich kale freshly harvested.",
    price: 3.49,
    unit: "bunch",
    imageUrl: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=1000",
    category: "vegetables",
    sellerId: "2",
    sellerName: "Green Valley Farm",
    available: true,
    organic: true,
    inSeason: true,
  },
  {
    id: "6",
    name: "Artisan Bread",
    description: "Handcrafted sourdough bread baked in wood-fired oven.",
    price: 6.99,
    unit: "loaf",
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?auto=format&fit=crop&q=80&w=1000",
    category: "bakery",
    sellerId: "5",
    sellerName: "Valley Bakery",
    available: true,
    organic: false,
    inSeason: true,
  },
];

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: String(Date.now()), // Simple ID generation
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(
      products.map((product) => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const getSellerProducts = (sellerId: string) => {
    return products.filter((product) => product.sellerId === sellerId);
  };

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter((product) => product.category === category);
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getSellerProducts,
    getProductById,
    getProductsByCategory,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
