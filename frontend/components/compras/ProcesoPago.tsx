"use client";
import { useState, useEffect } from "react";
import withAuth from '@/components/Auth/withAuth';
import { fetchUserData, putUserData } from "@/services/userCRUD";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import colombiaData from "@/components/ui/colombia/data_colombia.json";
import { AutocompleteColombia } from "@/components/ui/colombia/AutocompleteColombia";
import { getTiendaByRegionDepartamentoCiudad } from "@/services/tiendasCRUD";

const ProcesoPago = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  // variables para el manejo del proceoso de pago
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([1]); // Paso 1 siempre accesible
  const [formErrors, setFormErrors] = useState({});
  const [formEnvioErrors, setFormEnvioErrors] = useState({
        Region: false,
        Departamento: false,
        Ciudad: false
  });
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nombre_destinatario: "",
    direccion: "",
    email: "",
    telefono_envio: "",
    cedula: "",
  });
  const [formDataEnvio, setFormDataEnvio] = useState({
        Region: "",
        Departamento: "",
        Ciudad: "",
  });
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setUserId(userData.id);
        setFormData({
          nombre: userData.Nombre || "",
          apellido: userData.Apellido || "",
          direccion: userData.Direccion || "",
          email: userData.email || "",
          telefono_envio: "",
          nombre_destinatario:userData.Nombre || "",
          cedula: userData.cedula || "",
        });
      }
    };

    loadUserData();
  }, []);
  // Validación del formulario de identificación



  const validateStep1 = () => {
    const errors = {};

    if (!/^[a-zA-Z\s]+$/.test(formData.nombre)) errors.nombre = 'Nombre solo puede contener letras';
    if (!/^[a-zA-Z\s]+$/.test(formData.apellido)) errors.apellido = 'Apellido solo puede contener letras';
    if (formData.apellido.length < 2) errors.apellido = 'Apellido debe tener al menos 2 caracteres';
    if (!formData.nombre.trim()) errors.nombre = 'Nombre requerido';

  
    if (!formData.email.trim()) errors.email = 'Correo requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Correo inválido';

    if (!formData.telefono_envio.trim()) errors.telefono_envio = 'Teléfono requerido';
    
    if (!/^\d+$/.test(formData.telefono_envio)) errors.telefono_envio = 'Teléfono inválido';
    if (formData.telefono_envio.length < 10) errors.telefono_envio = 'Teléfono debe tener al menos 10 dígitos';
    if (formData.telefono_envio.length > 15) errors.telefono_envio = 'Teléfono no puede exceder 15 dígitos';

    if (!formData.nombre_destinatario.trim()) errors.nombre_destinatario = 'Nombre del destinatario requerido';
    if (!formData.direccion.trim()) errors.direccion = 'Dirección requerida';
    if (formData.direccion.length < 5) errors.direccion = 'Dirección debe tener al menos 5 caracteres';
    if (formData.direccion.length > 100) errors.direccion = 'Dirección no puede exceder 100 caracteres';




    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangeStep1 = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Inicializa formattedValue con value o cadena vacía si es undefined
    let formattedValue = value || '';
    const maxLengths = {
      nombre: 50,
      apellido: 50,
      cedula: 10,
      direccion: 100,
      email: 100,
      telefono: 15,
    };
    if (
      name === "nombre" || 
      name === "apellido" || 
      name === "direccion" || 
      name === "correo" || 
      name === "telefono_envio" ||
      name === "nombre_destinatario" ||
      name === "cedula"
    ) {
      if (name === "correo") {
        // Para el campo email, eliminar los espacios
        formattedValue = value.replace(/\s+/g, "");
      } else {
        // Para los otros campos, eliminar caracteres no deseados y los espacios al principio
        formattedValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, "") // Solo letras y espacios
                               .replace(/^\s+/, ""); // Eliminar espacios al principio
      }
    } else if (name === "cedula") {
      // Para el campo cédula, solo permitir números y limitar a 10 dígitos
      formattedValue = value.replace(/\D/g, "").slice(0, 10) // Solo números, máximo 10 dígitos
                             .replace(/^\s+/, ""); // Eliminar espacios al principio
    }
    if(name === "direccion" || name === "usuario"){
      // Para el campo dirección, eliminar caracteres no deseados y los espacios al principio
      formattedValue = value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s.,#-]/g, "") // Solo letras, números, espacios y caracteres permitidos
                             .replace(/^\s+/, ""); // Eliminar espacios al principio
    }
        if(name === "telefono_envio"){
      // Para el campo dirección, eliminar caracteres no deseados y los espacios al principio
          formattedValue = value.replace(/\D/g, "").slice(0, 10) // Solo números, máximo 10 dígitos
                             .replace(/^\s+/, ""); // Eliminar espacios al principio
    }
    
    // Aplicar límite de longitud a los inputs
    if (maxLengths[name]) {
      formattedValue = formattedValue.slice(0, maxLengths[name]);
    }


    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleChangeStep2 = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let formattedValue = value;

        setFormDataEnvio((prevData) => ({
            ...prevData,
            [name]: formattedValue,
        }));
  }
  const handlePayment = () => {
    setShowSuccess(true);
    setTimeout(() => {

      router.push('/router/historialcompras');
      setShowSuccess(false);
      // Aquí puedes agregar la lógica para guardar el pago en la base de datos
    }, 2000);
  };


  // Función para ir a un paso específico
  const goToStep = (step) => {
    // Permitir ir a pasos completados o al siguiente lógico
    if (completedSteps.includes(step) || step === Math.max(...completedSteps) + 1) {
      setCurrentStep(step);
    }
  };
  // Función para avanzar al siguiente paso
  const nextStep = () => {
  if (currentStep === 1 && !validateStep1()) return;
  
  if (currentStep === 2) {
    const isValid = validateStep2();
    if (!isValid) return;
  }

    const nextStepNumber = currentStep + 1;
    setCurrentStep(nextStepNumber);
    
    // Marcar el paso actual como completado y agregar el siguiente si no está
    if (!completedSteps.includes(nextStepNumber)) {
      setCompletedSteps([...completedSteps, nextStepNumber]);
    }
  };


  const validateStep2 = (): boolean => {
    const errors = {
      Region: false,
      Departamento: false,
      Ciudad: false
    };
    
    let isValid = true;

    // Validar región
    if (!formDataEnvio.Region) {
      errors.Region = true;
      isValid = false;
    } else {
      const regionValida = colombiaData.regiones.some(r => r.nombre === formDataEnvio.Region);
      if (!regionValida) {
        errors.Region = true;
        isValid = false;
      }
    }
    
    // Validar departamento solo si la región es válida
    if (isValid && !formDataEnvio.Departamento) {
      errors.Departamento = true;
      isValid = false;
    } else if (isValid && formDataEnvio.Departamento) {
      const region = colombiaData.regiones.find(r => r.nombre === formDataEnvio.Region);
      const deptoValido = region?.departamentos.some(d => d.nombre === formDataEnvio.Departamento);
      if (!deptoValido) {
        errors.Departamento = true;
        isValid = false;
      }
    }
    
    // Validar ciudad solo si el departamento es válido
    if (isValid && !formDataEnvio.Ciudad) {
      errors.Ciudad = true;
      isValid = false;
    } else if (isValid && formDataEnvio.Ciudad) {
      const region = colombiaData.regiones.find(r => r.nombre === formDataEnvio.Region);
      const departamento = region?.departamentos.find(d => d.nombre === formDataEnvio.Departamento);
      const ciudadValida = departamento?.ciudades.includes(formDataEnvio.Ciudad);
      if (!ciudadValida) {
        errors.Ciudad = true;
        isValid = false;
      }
    }
    
    setFormEnvioErrors(errors);
    return isValid;
  };


    const loadTiendasFiltradas = async () => {
        try {
        console.log("Datos de envío:", formDataEnvio);
        // const tiendaData = await getTiendaByRegionDepartamentoCiudad(formDataEnvio.Region, formDataEnvio.Departamento, formDataEnvio.Ciudad);
        // console.log("Datos completos de la tiendas encontradas:", tiendaData);
                    
        } catch (error) {
        console.error("Error al cargar datos de la tienda:", error);
        // setErrorMessage("Error al cargar los datos de la tienda");
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChangeStep1}
                    className={`w-full p-2 border rounded-md ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.nombre && <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido*</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChangeStep1}
                    className={`w-full p-2 border rounded-md ${formErrors.apellido ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.apellido && <p className="text-red-500 text-xs mt-1">{formErrors.apellido}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Documento de Identidad</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChangeStep1}
                    // no quiero que el usuario pueda editar la cedula, solo verla
                    readOnly
                    className={`w-full p-2 border rounded-md ${formErrors.cedula ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.cedula && <p className="text-red-500 text-xs mt-1">{formErrors.cedula}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChangeStep1}
                    className={`w-full p-2 border rounded-md ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
                  <input
                    type="tel"
                    name="telefono_envio"
                    value={formData.telefono_envio}
                    onChange={handleChangeStep1}
                    className={`w-full p-2 border rounded-md ${formErrors.telefono_envio ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.telefono_envio && <p className="text-red-500 text-xs mt-1">{formErrors.telefono_envio}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de envío*</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChangeStep1}
                    className={`w-full p-2 border rounded-md ${formErrors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.direccion && <p className="text-red-500 text-xs mt-1">{formErrors.direccion}</p>}
                </div>
                                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del destinario*</label>
                  <input
                    type="text"
                    name="nombre_destinatario"
                    value={formData.nombre_destinatario}
                    onChange={handleChangeStep1}
                    className={`w-full p-2 border rounded-md ${formErrors.nombre_destinatario ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.nombre_destinatario && <p className="text-red-500 text-xs mt-1">{formErrors.nombre_destinatario}</p>}
                </div>
              </div>

              {currentStep === 1 && (
                <div className="flex justify-end mt-6">
                  <button 
                    type="submit"
                    onClick={() => {
                            if (validateStep1()) {
                              nextStep(); // Solo avanza si el paso 1 es válido
                            }
                    }}
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
                  {/* Región como select */}
                  <div>
                    <label className="block text-sm font-medium">Región*</label>
                    <select
                      name="Region"
                      value={formDataEnvio.Region}
                      onChange={handleChangeStep2}
                      className={`w-full p-2 border rounded-md ${formEnvioErrors.Region ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Seleccione una región</option>
                      {colombiaData.regiones.map(region => (
                        <option key={region.nombre} value={region.nombre}>
                          {region.nombre}
                        </option>
                      ))}
                    </select>
                    {formEnvioErrors.Region && (
                      <p className="text-red-500 text-xs mt-1">Seleccione una región válida</p>
                    )}
                  </div>

                  {/* Departamento como select */}
                  <div>
                    <label className="block text-sm font-medium">Departamento*</label>
                    <select
                      name="Departamento"
                      value={formDataEnvio.Departamento}
                      onChange={(e) => {
                        handleChangeStep2(e);
                        setFormDataEnvio(prev => ({...prev, Ciudad: ""}));
                      }}
                      disabled={!formDataEnvio.Region}
                      className={`w-full p-2 border rounded-md ${formEnvioErrors.Departamento ? 'border-red-500' : 'border-gray-300'} ${!formDataEnvio.Region ? 'bg-gray-100' : ''}`}
                    >
                      <option value="">Seleccione un departamento</option>
                      {formDataEnvio.Region && 
                        colombiaData.regiones
                          .find(r => r.nombre === formDataEnvio.Region)
                          ?.departamentos.map(depto => (
                            <option key={depto.nombre} value={depto.nombre}>
                              {depto.nombre}
                            </option>
                          ))
                      }
                    </select>
                    {formEnvioErrors.Departamento && (
                      <p className="text-red-500 text-xs mt-1">Seleccione un departamento válido</p>
                    )}
                  </div>

                  {/* Ciudad como select */}
                  <div>
                    <label className="block text-sm font-medium">Ciudad*</label>
                    <select
                      name="Ciudad"
                      value={formDataEnvio.Ciudad}
                      onChange={handleChangeStep2}
                      disabled={!formDataEnvio.Departamento}
                      className={`w-full p-2 border rounded-md ${formEnvioErrors.Ciudad ? 'border-red-500' : 'border-gray-300'} ${!formDataEnvio.Departamento ? 'bg-gray-100' : ''}`}
                    >
                      <option value="">Seleccione una ciudad</option>
                      {formDataEnvio.Departamento && 
                        colombiaData.regiones
                          .find(r => r.nombre === formDataEnvio.Region)
                          ?.departamentos
                          .find(d => d.nombre === formDataEnvio.Departamento)
                          ?.ciudades.map(ciudad => (
                            <option key={ciudad} value={ciudad}>
                              {ciudad}
                            </option>
                          ))
                      }
                    </select>
                    {formEnvioErrors.Ciudad && (
                      <p className="text-red-500 text-xs mt-1">Seleccione una ciudad válida</p>
                    )}
                  </div>

                  {/* Método de entrega (se mantiene igual) */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Método de entrega*</p>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={async () => {
                          setDeliveryMethod('Retirar en tienda');
                          await loadTiendasFiltradas(); // Si loadTiendasFiltradas es async
                        }}
                        disabled={!formDataEnvio.Region || !formDataEnvio.Departamento || !formDataEnvio.Ciudad}
                        className={`px-4 py-2 rounded-md border ${deliveryMethod === 'Retirar en tienda' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'border-gray-300'}`}
                      >
                        Retirar en tienda
                      </button>
                      <button
                        type="button"
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
                      className={`px-4 py-2 rounded-md text-white ${
                        deliveryMethod && !formEnvioErrors.Region && !formEnvioErrors.Departamento && !formEnvioErrors.Ciudad
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'bg-gray-400 cursor-not-allowed'
                      } transition`}
                      disabled={!deliveryMethod || formEnvioErrors.Region || formEnvioErrors.Departamento || formEnvioErrors.Ciudad}
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