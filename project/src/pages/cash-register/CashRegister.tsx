import React, { useState } from 'react';
import { 
  DollarSign, 
  PlusCircle, 
  MinusCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CashMovement {
  id: string;
  type: 'entrada' | 'saida';
  amount: number;
  description: string;
  timestamp: Date;
}

const CashRegister: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [initialAmount, setInitialAmount] = useState(500);
  const [currentAmount, setCurrentAmount] = useState(500);
  const [movementType, setMovementType] = useState<'entrada' | 'saida'>('entrada');
  const [movementAmount, setMovementAmount] = useState('');
  const [movementDescription, setMovementDescription] = useState('');
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [showCloseCashModal, setShowCloseCashModal] = useState(false);
  const [closingNote, setClosingNote] = useState('');
  const [physicalAmount, setPhysicalAmount] = useState('');

  const handleOpenCash = () => {
    if (initialAmount <= 0) {
      toast.error('O valor inicial deve ser maior que zero');
      return;
    }
    
    setIsOpen(true);
    setCurrentAmount(initialAmount);
    toast.success('Caixa aberto com sucesso!');
  };

  const handleAddMovement = () => {
    const amount = parseFloat(movementAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Informe um valor válido');
      return;
    }
    
    if (!movementDescription.trim()) {
      toast.error('Informe uma descrição');
      return;
    }
    
    const newMovement: CashMovement = {
      id: Date.now().toString(),
      type: movementType,
      amount,
      description: movementDescription,
      timestamp: new Date()
    };
    
    setMovements([newMovement, ...movements]);
    
    if (movementType === 'entrada') {
      setCurrentAmount(currentAmount + amount);
    } else {
      if (amount > currentAmount) {
        toast.error('Valor de saída não pode ser maior que o saldo atual');
        return;
      }
      setCurrentAmount(currentAmount - amount);
    }
    
    setMovementAmount('');
    setMovementDescription('');
    toast.success(`${movementType === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`);
  };

  const handleCloseCash = () => {
    const physical = parseFloat(physicalAmount);
    
    if (isNaN(physical)) {
      toast.error('Informe o valor físico em caixa');
      return;
    }
    
    const difference = physical - currentAmount;
    
    setIsOpen(false);
    setShowCloseCashModal(false);
    
    if (difference !== 0) {
      toast.error(`Diferença de caixa: R$ ${Math.abs(difference).toFixed(2)} ${difference > 0 ? 'a mais' : 'a menos'}`);
    } else {
      toast.success('Caixa fechado com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cash Register Status */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Status do Caixa
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    O caixa está {isOpen ? 'aberto' : 'fechado'}.
                    {isOpen && ` Saldo atual: R$ ${currentAmount.toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>
            <div>
              {isOpen ? (
                <button
                  type="button"
                  onClick={() => setShowCloseCashModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Fechar Caixa
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="initialAmount" className="block text-sm font-medium text-gray-700">
                      Valor Inicial (R$)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="initialAmount"
                        id="initialAmount"
                        value={initialAmount}
                        onChange={(e) => setInitialAmount(Number(e.target.value))}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCash}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Abrir Caixa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Cash Movement Form */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Registrar Movimentação
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="movementType" className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <select
                    id="movementType"
                    name="movementType"
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as 'entrada' | 'saida')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída (Sangria)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="movementAmount" className="block text-sm font-medium text-gray-700">
                    Valor (R$)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="movementAmount"
                      id="movementAmount"
                      value={movementAmount}
                      onChange={(e) => setMovementAmount(e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="movementDescription" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="movementDescription"
                      id="movementDescription"
                      value={movementDescription}
                      onChange={(e) => setMovementDescription(e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ex: Venda, Pagamento, etc."
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleAddMovement}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {movementType === 'entrada' ? (
                    <PlusCircle className="mr-2 h-5 w-5" />
                  ) : (
                    <MinusCircle className="mr-2 h-5 w-5" />
                  )}
                  Registrar {movementType === 'entrada' ? 'Entrada' : 'Saída'}
                </button>
              </div>
            </div>
          </div>

          {/* Cash Movements List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Movimentações do Caixa
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Histórico de entradas e saídas
              </p>
            </div>
            <div className="overflow-x-auto">
              {movements.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movements.map((movement) => (
                      <tr key={movement.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {movement.timestamp.toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {movement.type === 'entrada' ? (
                              <ArrowUpCircle className="h-5 w-5 mr-1 text-green-500" />
                            ) : (
                              <ArrowDownCircle className="h-5 w-5 mr-1 text-red-500" />
                            )}
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              movement.type === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {movement.type === 'entrada' ? 'Entrada' : 'Saída'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {movement.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {movement.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Nenhuma movimentação registrada
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Close Cash Modal */}
      {showCloseCashModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <XCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Fechar Caixa
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="physicalAmount" className="block text-sm font-medium text-gray-700">
                          Valor físico em caixa (R$)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="physicalAmount"
                            id="physicalAmount"
                            value={physicalAmount}
                            onChange={(e) => setPhysicalAmount(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="closingNote" className="block text-sm font-medium text-gray-700">
                          Observações
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="closingNote"
                            name="closingNote"
                            rows={3}
                            value={closingNote}
                            onChange={(e) => setClosingNote(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Observações sobre o fechamento do caixa"
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          onClick={handleCloseCash}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Fechar Caixa
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCloseCashModal(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashRegister;