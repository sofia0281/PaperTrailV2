"use client";
import { useState, useEffect } from "react";
import withAuth from '@/components/Auth/withAuth';

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";




const ProcesoPago = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([1]); // Paso 1 siempre accesible
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: 'Jancario Galion',
    correo: 'galion@ejemplo.com',
    telefono: '',
    direccion: ''
  });

  const validateStep1 = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'Nombre requerido';
    if (!formData.correo.trim()) errors.correo = 'Correo requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.correo)) errors.correo = 'Correo inválido';
    if (!formData.telefono.trim()) errors.telefono = 'Teléfono requerido';
    if (!formData.direccion.trim()) errors.direccion = 'Dirección requerida';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error al escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handlePayment = () => {
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const goToStep = (step) => {
    // Permitir ir a pasos completados o al siguiente lógico
    if (completedSteps.includes(step) || step === Math.max(...completedSteps) + 1) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    
    const nextStepNumber = currentStep + 1;
    setCurrentStep(nextStepNumber);
    
    // Marcar el paso actual como completado y agregar el siguiente si no está
    if (!completedSteps.includes(nextStepNumber)) {
      setCompletedSteps([...completedSteps, nextStepNumber]);
    }
  };

  return (
    <div className="flex justify-center gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Notificación de éxito */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/3 h-auto flex items-center z-20 justify-between px-8 py-5 rounded-lg shadow-lg text-white text-sm bg-orange-500"
        >
          <span>¡Pago realizado con éxito!</span>
          <XCircle
            size={22}
            className="cursor-pointer hover:text-gray-200"
            onClick={() => setShowSuccess(false)}
          />
        </motion.div>
      )}

      <div className="max-w-4xl w-full space-y-6">
        {/* Barra de progreso */}
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-full bg-orange-500 transition-all duration-300" 
              style={{ width: `${(Math.max(...completedSteps) - 1) * 50}%` }}
            ></div>
          </div>
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <button
                onClick={() => goToStep(step)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  currentStep === step ? 'bg-orange-600 text-white scale-110' : 
                  completedSteps.includes(step) ? 'bg-orange-400 text-white' : 
                  'bg-gray-200 text-gray-600'
                } ${
                  completedSteps.includes(step) || step === Math.max(...completedSteps) + 1 ? 
                  'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
                }`}
              >
                {step}
              </button>
              <span className="text-xs mt-1">
                {step === 1 ? 'Identificación' : step === 2 ? 'Envío' : 'Pago'}
              </span>
            </div>
          ))}
        </div>

        {/* Sección de Identificación (Formulario) */}
        <div className={`bg-white shadow-md rounded-lg overflow-hidden transition-all ${currentStep === 1 ? '' : 'opacity-50'}`}>
          <div className={`p-4 ${currentStep === 1 ? 'bg-orange-500' : 'bg-orange-300'} text-white`}>
            <h2 className="text-lg font-bold">Identificación</h2>
          </div>
          <div className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo*</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.nombre && <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico*</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${formErrors.correo ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.correo && <p className="text-red-500 text-xs mt-1">{formErrors.correo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${formErrors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.telefono && <p className="text-red-500 text-xs mt-1">{formErrors.telefono}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección*</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${formErrors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.direccion && <p className="text-red-500 text-xs mt-1">{formErrors.direccion}</p>}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <button 
                    type="button" 
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => router.push('/login')}
                  >
                    No soy yo. Cerrar Sesión
                  </button>
                </div>
              </div>

              {currentStep === 1 && (
                <div className="flex justify-end mt-6">
                  <button 
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sección de Envío */}
        <div className={`bg-white shadow-md rounded-lg overflow-hidden transition-all ${currentStep === 2 ? '' : 'opacity-50'}`}>
          <div className={`p-4 ${currentStep === 2 ? 'bg-orange-500' : completedSteps.includes(2) ? 'bg-orange-300' : 'bg-gray-300'} text-white`}>
            <h2 className="text-lg font-bold">Envío</h2>
          </div>
          <div className="p-6">
            {completedSteps.includes(2) || currentStep === 2 ? (
              <>
                <div className="space-y-4 ml-4">
                  <div>
                    <p className="text-sm text-gray-500">Departamento</p>
                    <select className="border border-gray-300 rounded-md p-2 w-full max-w-xs">
                      <option>Valle del Cauca</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ciudad</p>
                    <select className="border border-gray-300 rounded-md p-2 w-full max-w-xs">
                      <option>Cartago</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Método de entrega</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setDeliveryMethod('Retirar en tienda')}
                        className={`px-4 py-2 rounded-md border ${deliveryMethod === 'Retirar en tienda' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'border-gray-300'}`}
                      >
                        Retirar en tienda
                      </button>
                      <button
                        onClick={() => setDeliveryMethod('Enviar a domicilio')}
                        className={`px-4 py-2 rounded-md border ${deliveryMethod === 'Enviar a domicilio' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'border-gray-300'}`}
                      >
                        Enviar a domicilio
                      </button>
                    </div>
                  </div>
                </div>
                {currentStep === 2 && (
                  <div className="flex justify-end mt-6">
                    <button 
                      onClick={nextStep}
                      disabled={!deliveryMethod}
                      className={`px-4 py-2 rounded-md text-white ${deliveryMethod ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} transition`}
                    >
                      Continuar
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Completa el paso anterior para habilitar esta sección
              </div>
            )}
          </div>
        </div>

        {/* Sección de Método de Pago */}
        <div className={`bg-white shadow-md rounded-lg overflow-hidden transition-all ${currentStep === 3 ? '' : 'opacity-50'}`}>
          <div className={`p-4 ${currentStep === 3 ? 'bg-orange-500' : completedSteps.includes(3) ? 'bg-orange-300' : 'bg-gray-300'} text-white`}>
            <h2 className="text-lg font-bold">Método de Pago</h2>
          </div>
          <div className="p-6">
            {completedSteps.includes(3) || currentStep === 3 ? (
              <>
                <div className="space-y-4 ml-4">
                  <div className="space-y-2">
                    <div
                      onClick={() => setPaymentMethod('Debito')}
                      className={`p-4 border rounded-md cursor-pointer ${paymentMethod === 'Debito' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Débito</span>
                        <button className="text-sm text-orange-500">Seleccionar</button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">XXXXXXXXXX,XXX</p>
                    </div>
                    <div
                      onClick={() => setPaymentMethod('Credito')}
                      className={`p-4 border rounded-md cursor-pointer ${paymentMethod === 'Credito' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Crédito</span>
                        <button className="text-sm text-orange-500">Seleccionar</button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">XXXXXXXXXX,XXX</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <p className="font-semibold">Monto: $20.000</p>
                    {currentStep === 3 && (
                      <button
                        onClick={handlePayment}
                        disabled={!paymentMethod}
                        className={`px-6 py-2 rounded-md text-white ${paymentMethod ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} transition`}
                      >
                        Pagar
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Completa el paso anterior para habilitar esta sección
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ProcesoPago);