import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  Smartphone,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  discount: number;
  finalTotal: number;
  paymentMethod: string;
  timestamp: Date;
}

const Sales: React.FC = () => {
  // Mock products
  const mockProducts: Product[] = [
    { id: '1', name: 'X-Tudo', price: 18.90, category: 'Lanches' },
    { id: '2', name: 'X-Salada', price: 15.90, category: 'Lanches' },
    { id: '3', name: 'X-Bacon', price: 16.90, category: 'Lanches' },
    { id: '4', name: 'Coca-Cola 350ml', price: 5.50, category: 'Bebidas' },
    { id: '5', name: 'Água Mineral 500ml', price: 3.50, category: 'Bebidas' },
    { id: '6', name: 'Suco Natural', price: 7.90, category: 'Bebidas' },
    { id: '7', name: 'Batata Frita P', price: 8.90, category: 'Porções' },
    { id: '8', name: 'Batata Frita M', price: 12.90, category: 'Porções' },
    { id: '9', name: 'Batata Frita G', price: 16.90, category: 'Porções' },
    { id: '10', name: 'Açaí 300ml', price: 14.90, category: 'Sobremesas' },
    { id: '11', name: 'Pudim', price: 8.90, category: 'Sobremesas' },
    { id: '12', name: 'Sorvete', price: 7.90, category: 'Sobremesas' },
  ];

  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [showSaleHistory, setShowSaleHistory] = useState(false);

  const categories = Array.from(new Set(products.map(product => product.category)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount;
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast.error('Adicione produtos ao carrinho');
      return;
    }
    
    const subtotal = calculateSubtotal();
    const total = calculateTotal();
    
    if (total <= 0) {
      toast.error('O valor total não pode ser menor ou igual a zero');
      return;
    }
    
    const newSale: Sale = {
      id: Date.now().toString(),
      items: [...cart],
      total: subtotal,
      discount,
      finalTotal: total,
      paymentMethod,
      timestamp: new Date()
    };
    
    setSales([newSale, ...sales]);
    
    // Reset cart and form
    setCart([]);
    setDiscount(0);
    setPaymentMethod('dinheiro');
    
    toast.success('Venda finalizada com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products Section */}
        <div className="lg:w-2/3 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Produtos
              </h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Todas categorias</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <span className="text-sm text-gray-500">{product.category}</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:w-1/3 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Carrinho
            </h3>
            <button
              type="button"
              onClick={() => setShowSaleHistory(!showSaleHistory)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showSaleHistory ? 'Voltar ao Carrinho' : 'Histórico de Vendas'}
            </button>
          </div>

          {!showSaleHistory ? (
            <>
              <div className="px-4 py-5 sm:p-6 flex-grow">
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center border-b pb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-500">
                            R$ {item.product.price.toFixed(2)} x {item.quantity} = R$ {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-gray-700">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 rounded-full text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Carrinho vazio
                  </div>
                )}
              </div>

              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Subtotal:</span>
                    <span className="text-lg font-medium text-gray-900">R$ {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div>
                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                      Desconto (R$)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="discount"
                        id="discount"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        min="0"
                        max={calculateSubtotal()}
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                      Forma de Pagamento
                    </label>
                    <div className="mt-1">
                      <div className="grid grid-cols-3 gap-2">
                        <div
                          className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer ${
                            paymentMethod === 'dinheiro' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
                          }`}
                          onClick={() => setPaymentMethod('dinheiro')}
                        >
                          <DollarSign className={`h-5 w-5 ${paymentMethod === 'dinheiro' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className="text-xs mt-1">Dinheiro</span>
                        </div>
                        <div
                          className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer ${
                            paymentMethod === 'cartao' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
                          }`}
                          onClick={() => setPaymentMethod('cartao')}
                        >
                          <CreditCard className={`h-5 w-5 ${paymentMethod === 'cartao' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className="text-xs mt-1">Cartão</span>
                        </div>
                        <div
                          className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer ${
                            paymentMethod === 'pix' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
                          }`}
                          onClick={() => setPaymentMethod('pix')}
                        >
                          <Smartphone className={`h-5 w-5 ${paymentMethod === 'pix' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <span className="text-xs mt-1">Pix</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-blue-600">R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleCompleteSale}
                    disabled={cart.length === 0}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Finalizar Venda
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Vendas</h3>
              
              {sales.length > 0 ? (
                <div className="space-y-4">
                  {sales.map((sale) => (
                    <div key={sale.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Venda #{sale.id.slice(-4)}</h4>
                          <p className="text-sm text-gray-500">
                            {sale.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <span className="font-bold text-blue-600">
                          R$ {sale.finalTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Itens: {sale.items.reduce((total, item) => total + item.quantity, 0)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Pagamento: {
                            sale.paymentMethod === 'dinheiro' ? 'Dinheiro' : 
                            sale.paymentMethod === 'cartao' ? 'Cartão' : 'Pix'
                          }
                        </p>
                        {sale.discount > 0 && (
                          <p className="text-sm text-gray-500">
                            Desconto: R$ {sale.discount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Nenhuma venda registrada
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;