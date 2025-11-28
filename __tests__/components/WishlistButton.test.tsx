import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { WishlistButton } from '@/components/WishlistButton';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<WishlistProvider>{component}</WishlistProvider>);
};

describe('WishlistButton', () => {
  beforeEach(() => {
    // Nettoyer localStorage avant chaque test
    localStorage.clear();
  });

  const mockProduct = {
    productId: '1',
    sku: 'SKU-001',
    name: 'Test Product',
    priceHT: 10000,
    vatRate: 0.2,
    image: 'https://example.com/image.jpg',
    brand: 'Test Brand',
  };

  it('renders correctly', () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('adds product to wishlist on click', async () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);
    const button = screen.getByRole('button');
    
    await act(async () => {
      fireEvent.click(button);
      // Attendre que le contexte se mette à jour
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Vérifier que le produit est ajouté (le bouton devrait changer d'état)
    await waitFor(() => {
      expect(button).toHaveClass('bg-violet-electric');
    });
  });

  it('toggles product in wishlist', async () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);
    
    // Attendre que le contexte soit chargé
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    const button = screen.getByRole('button');
    
    // Vérifier l'état initial
    expect(button).toHaveAttribute('aria-label', `Ajouter ${mockProduct.name} à la liste de souhaits`);
    
    // Ajouter
    await act(async () => {
      fireEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 150));
    });
    
    await waitFor(() => {
      const updatedButton = screen.getByRole('button');
      expect(updatedButton).toHaveAttribute('aria-label', `Retirer ${mockProduct.name} de la liste de souhaits`);
    }, { timeout: 2000 });
    
    // Retirer
    const updatedButton = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(updatedButton);
      await new Promise(resolve => setTimeout(resolve, 150));
    });
    
    await waitFor(() => {
      const finalButton = screen.getByRole('button');
      expect(finalButton).toHaveAttribute('aria-label', `Ajouter ${mockProduct.name} à la liste de souhaits`);
    }, { timeout: 2000 });
  });

  it('has correct aria-label when not in wishlist', () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', `Ajouter ${mockProduct.name} à la liste de souhaits`);
  });

  it('has correct aria-label when in wishlist', async () => {
    renderWithProvider(<WishlistButton {...mockProduct} />);
    const button = screen.getByRole('button');
    
    await act(async () => {
      fireEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-label', `Retirer ${mockProduct.name} de la liste de souhaits`);
    });
  });
});

