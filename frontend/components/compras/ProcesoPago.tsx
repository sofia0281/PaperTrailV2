"use client";
import { useState, useEffect } from "react";
import withAuth from '@/components/Auth/withAuth';
import CashCardPago from "@/components/ui/cashcardPago";
import { fetchUserData, putUserData } from "@/services/userCRUD";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import colombiaData from "@/components/ui/colombia/data_colombia.json";
import { useAuth } from '@/context/AuthContext';
import { getTiendaByRegionDepartamentoCiudad } from "@/services/tiendasCRUD";
import { getCardsByUser} from '@/services/cardCRUD';
import { createPedido, createItemPedido } from "@/services/pedidosCRUD";
import { getPedidosByUser } from "@/services/pedidosCRUD";
import { getBookByIdLibro , putBookData } from "@/services/bookCRUD";
import { updateCard} from "@/services/cardCRUD";
const ProcesoPago = () => {
  const router = useRouter();
  const { cart, authUser, clearCart } = useAuth();
  // Calcular el total del carrito
  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const [userId, setUserId] = useState<number | null>(null);
  // variables para el manejo del proceoso de pago
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([1]); // Paso 1 siempre accesible
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nombre_destinatario: "",
    email: "",
    telefono_envio: "",
    cedula: "",
  });

  const [formEnvioErrors, setFormEnvioErrors] = useState({
      Region: false,
      Departamento: false,
      Ciudad: false,
      direccion: false,
  });
  const [formDataEnvio, setFormDataEnvio] = useState({
        Region: "",
        Departamento: "",
        Ciudad: "",
        direccion: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setUserId(userData.id);
        setFormData({
          nombre: userData.Nombre || "",
          apellido: userData.Apellido || "",
          email: userData.email || "",
          telefono_envio: "",
          nombre_destinatario:userData.Nombre || "",
          cedula: userData.cedula || "",
        });
        setFormDataEnvio(prev =>({
          ...prev,
          direccion: userData.direccion || "",
        }));
      }
    };

    loadUserData();
  }, []);
  


//----------------------------- Validación del formulario de identificación STEP 1-----------------------
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
      email: 100,
      telefono: 15,
    };
    if (
      name === "nombre" || 
      name === "apellido" || 
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
    
    if(name === "telefono_envio"){
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

  // ----------------------------- Validación del formulario de envío STEP 2-----------------------
  const handleChangeStep2 = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "direccion") {
      formattedValue = value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s.,#-]/g, "").replace(/^\s+/, "");
    }
    if (name === "Region" || name === "Departamento" || name === "Ciudad") {
      setDeliveryMethod(''); // Quita la selección del método de entrega
      setTiendas([]); // Limpia la lista de tiendas
      setTiendaSeleccionada(null); // Quita la tienda seleccionada
    }

    // Limpiar errores cuando se cambia un campo
    setFormEnvioErrors(prev => ({
      ...prev,
      [name]: false,
      ...(name === "Region" && { Departamento: false, Ciudad: false }),
      ...(name === "Departamento" && { Ciudad: false })
    }));

    // Resetear dependencias cuando cambia la región o departamento
    if (name === "Region") {
      setFormDataEnvio(prev => ({
        ...prev,
        Region: formattedValue,
        Departamento: "",
        Ciudad: ""
      }));
    } else if (name === "Departamento") {
      setFormDataEnvio(prev => ({
        ...prev,
        Departamento: formattedValue,
        Ciudad: ""
      }));
    } else {
      setFormDataEnvio(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
  };

  const validateStep2 = (): boolean => {
    const newErrors = {
      Region: false,
      Departamento: false,
      Ciudad: false,
      direccion: false
    };
    
    let isValid = true;

    // Validar región
    if (!formDataEnvio.Region) {
      newErrors.Region = true;
      isValid = false;
    }

    // Validar departamento solo si la región es válida
    if (isValid && !formDataEnvio.Departamento) {
      newErrors.Departamento = true;
      isValid = false;
    }

    // Validar ciudad solo si departamento es válido
    if (isValid && !formDataEnvio.Ciudad) {
      newErrors.Ciudad = true;
      isValid = false;
    }

    // Validar dirección solo para envío a domicilio
    if (deliveryMethod === 'Enviar a domicilio') {
      if (!formDataEnvio.direccion.trim()) {
        newErrors.direccion = true;
        isValid = false;
      } else if (formDataEnvio.direccion.length < 5) {
        newErrors.direccion = true;
        isValid = false;
      } else if (formDataEnvio.direccion.length > 100) {
        newErrors.direccion = true;
        isValid = false;
      }
    }

    setFormEnvioErrors(newErrors);
    return isValid;
  };

// para manejar el listado de tiendas 
  const [tiendas, setTiendas] = useState<any[]>([]);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState<string | null>(null);
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const loadTiendasFiltradas = async () => {
    try {
      console.log("Datos de envío:", formDataEnvio);
      const tiendaData = await getTiendaByRegionDepartamentoCiudad(
        formDataEnvio.Region, 
        formDataEnvio.Departamento, 
        formDataEnvio.Ciudad
      );
      
      console.log("Datos completos de las tiendas encontradas:", tiendaData);
      setTiendas(tiendaData.data || []); // Asumiendo que la respuesta tiene formato { data: [...] }
      setTiendaSeleccionada(null); // Resetear selección al cargar nuevas tiendas
    } catch (error) {
      console.error("Error al cargar datos de la tienda:", error);
      setTiendas([]);
      // setErrorMessage("Error al cargar los datos de la tienda");
    }
  };
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const handleDeliveryMethodChange = (method: 'Retirar en tienda' | 'Enviar a domicilio') => {
    setDeliveryMethod(method);
    if (method === 'Retirar en tienda') {
      loadTiendasFiltradas();
    } else {
      setTiendas([]);
      setTiendaSeleccionada(null);
    }
  };
// --------------------STEP 3-----------------------------
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cards, setCards] = useState([]);
  const fetchCards = async () => {
    if (!authUser?.id) return;
    try {
      const data = await getCardsByUser(authUser.id);
      console.log("Datos de las tarjetas:", data);
      
      setCards(data);
    } catch (error) {
      console.error("No se pudieron cargar las tarjetas");
    }
  };
  useEffect(() => {
    fetchCards();
  }, [authUser]);

  // -------------------------------------Función para manejar el pago---------------------
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handlePayment = async () => {
    if (!selectedCardId) return;
    console.log("Tarjeta seleccionada para pago:", selectedCardId);

    try {
          // Obtener número de pedido
      console.log("ID del usuario que va a comprar:", authUser.id); 
      const response = await getPedidosByUser(authUser.id);
      const numCompra = response.data.length + 1;
      console.log("Número de compra:", numCompra);
      const montoNumerico = parseInt(selectedCard.Monto.replace(/\./g, ''), 10);
      const nuevoMonto = montoNumerico - total;
      console.log("Nuevo monto después de la compra:", nuevoMonto);
      const cardPayload = {
              Numero: selectedCard.number,
              Titular: selectedCard.name,
              FechaVencimiento: selectedCard.fechaVencimiento,
              Ultimos4Digitos: selectedCard.cvc,
              Banco: selectedCard.bancoDetectado,
              Tipo: selectedCard.tipo,
              Monto: nuevoMonto,
      };
      
      await updateCard(selectedCardId, cardPayload); // Usa el ID real

      // Crear el pedido principal
      const pedidoResponse = await createPedido({
        usuario: authUser.id,
        TotalPrecio: cart.reduce((sum, item) => sum + item.totalPrice, 0),
        TotalProductos: cart.reduce((sum, item) => sum + item.quantity, 0),
        idPedido: numCompra.toString(),
        direccion_envio: formDataEnvio.direccion || "Recoger en tienda",
        nombre_destinario: formData.nombre_destinatario,
      });
  
      // Actualizar inventario y crear ítems
      await Promise.all(
        cart.map(async (item) => {
          const bookData = await getBookByIdLibro(item.idLibro);
          const newCantidad = bookData.cantidad - item.quantity;
  
          const updatedBookData = {
            ISBN_ISSN: bookData.ISBN_ISSN,
            fecha_publicacion: bookData.fecha_publicacion,
            title: bookData.title,
            condition: bookData.condition,
            author: bookData.author,
            price: bookData.price,
            editorial: bookData.editorial,
            numero_paginas: bookData.numero_paginas,
            genero: bookData.genero,
            idioma: bookData.idioma,
            cantidad: newCantidad,
            idLibro: bookData.idLibro,
          };

          await putBookData(updatedBookData, item.idLibro);
  
          await createItemPedido({
            PrecioItem: item.unitPrice,
            Cantidad: item.quantity,
            IdItem: item.idLibro,
            IdPedido: pedidoResponse.data.id,
            Title: item.title,
            totalPrice: item.totalPrice,
            idstatus: numCompra.toString(),
          });
        })
      );
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/routes/purchasehistory')
        clearCart();
        setShowSuccess(false);
      }, 2000);
     }catch (error) {
      if (error.message === "stock-insuficiente") {
        // Ya se mostró mensaje
      } else {
        console.error("Error al crear pedido:", error);
        setErrorMessage("Error al realizar el pedido");
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } 

  };

  // --------------------------Función para manejar LOS PASOS DEL FORMULARIO
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [selectedCard, setSelectedCard] = useState<string[]>([]);
  return (
    <div className="flex justify-center gap-6 p-6 bg-gray-100 min-h-screen">
          {(successMessage || errorMessage) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-17 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/3 h-auto flex items-center z-20 justify-between px-8 py-5 rounded-lg shadow-lg text-white text-sm ${
            successMessage ? "bg-orange-500" : "bg-black"
          }`}
        >
          <span>{successMessage || errorMessage}</span>
          <XCircle
            size={22}
            className="cursor-pointer hover:text-gray-200"
            onClick={() => {
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
          />
        </motion.div>
      )} 
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

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de envío*</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChangeStep1}
                    className={`w-full p-2 border rounded-md ${formErrors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.direccion && <p className="text-red-500 text-xs mt-1">{formErrors.direccion}</p>}
                </div> */}
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
                  {/* Región */}
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

                  {/* Departamento */}
                  <div>
                    <label className="block text-sm font-medium">Departamento*</label>
                    <select
                      name="Departamento"
                      value={formDataEnvio.Departamento}
                      onChange={handleChangeStep2}
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

                  {/* Ciudad */}
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

                  {/* Método de entrega*/}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Método de entrega*</p>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          handleDeliveryMethodChange('Retirar en tienda');
                          loadTiendasFiltradas();
                        }}
                        disabled={!formDataEnvio.Region || !formDataEnvio.Departamento || !formDataEnvio.Ciudad}
                        className={`px-4 py-2 rounded-md border ${
                          deliveryMethod === 'Retirar en tienda' 
                            ? 'bg-orange-100 border-orange-500 text-orange-700' 
                            : 'border-gray-300'
                        }`}
                      >
                        Retirar en tienda
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeliveryMethodChange('Enviar a domicilio')}
                        className={`px-4 py-2 rounded-md border ${
                          deliveryMethod === 'Enviar a domicilio' 
                            ? 'bg-orange-100 border-orange-500 text-orange-700' 
                            : 'border-gray-300'
                        }`}
                      >
                        Enviar a domicilio
                      </button>
                    </div>
                  </div>

                    {/* Lista de tiendas (solo para retiro en tienda) */}
                    {deliveryMethod === 'Retirar en tienda' && tiendas.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Selecciona una tienda*</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {tiendas.map((tienda) => (
                            <div 
                              key={tienda.id}
                              onClick={() => setTiendaSeleccionada(tienda.id)}
                              className={`p-3 border rounded-md cursor-pointer ${
                                tiendaSeleccionada === tienda.id
                                  ? 'bg-orange-50 border-orange-500'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <p className="font-medium">{tienda.Nombre || 'Tienda sin nombre'}</p>
                              <p className="text-sm text-gray-600">{tienda.Direction}</p>
                              <p className="text-xs text-gray-500">
                                {tienda.Ciudad}, {tienda.Departamento}
                              </p>
                            </div>
                          ))}
                        </div>
                        {tiendas.length === 0 && (
                          <p className="text-sm text-gray-500">No hay tiendas disponibles en esta ubicación</p>
                        )}
                      </div>
                    )}

                    {/* Campo de dirección (solo para envío a domicilio) */}
                    {deliveryMethod === 'Enviar a domicilio' && (
                      <div className="mt-4">
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección de envío*
                        </label>
                        <input
                          type="text"
                          name="direccion"
                          value={formDataEnvio.direccion}
                          onChange={handleChangeStep2}
                          className={`w-full p-2 border rounded-md ${formEnvioErrors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Ingresa tu dirección completa"
                          required
                        />
                        {formEnvioErrors.direccion && (
                          <p className="text-red-500 text-xs mt-1">
                            {!formDataEnvio.direccion.trim() ? 'Dirección requerida' : 
                            formDataEnvio.direccion.length < 5 ? 'Dirección debe tener al menos 5 caracteres' :
                            'Dirección no puede exceder 100 caracteres'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                {currentStep === 2 && (
                  <div className="flex justify-end mt-6">
                    <button 
                        onClick={nextStep}
                        className={`px-4 py-2 rounded-md text-white ${
                          deliveryMethod && 
                          (!formEnvioErrors.Region && !formEnvioErrors.Departamento && !formEnvioErrors.Ciudad) &&
                          (deliveryMethod === 'Retirar en tienda' ? tiendaSeleccionada : true) &&
                          (deliveryMethod === 'Enviar a domicilio' ? formDataEnvio.direccion.trim() : true)
                            ? 'bg-orange-500 hover:bg-orange-600' 
                            : 'bg-gray-400 cursor-not-allowed'
                        } transition`}
                        disabled={
                          !deliveryMethod || 
                          formEnvioErrors.Region || 
                          formEnvioErrors.Departamento || 
                          formEnvioErrors.Ciudad ||
                          (deliveryMethod === 'Retirar en tienda' && !tiendaSeleccionada) ||
                          (deliveryMethod === 'Enviar a domicilio' && !formDataEnvio.direccion.trim())
                        }
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
                  {/* Lista de tarjetas */}
                  <div className="w-full flex flex-wrap items-start px-6 gap-6 py-6 justify-center lg:justify-start">
                    {cards.length === 0 ? (
                      <p className="text-gray-500">No tienes tarjetas registradas.</p>
                    ) : (
                      cards
                        .filter(card => card.Monto >= total)
                        .map((card) => (
                          <div
                            key={card.documentId}
                            onClick={() => {
                              setSelectedCardId(card.documentId);
                              setPaymentMethod(card.documentId);
                              setSelectedCard(card);
                            }}
                          >
                            <CashCardPago
                              numero={card.Numero}
                              banco={card.Banco}
                              tipo={card.Tipo}
                              titular={card.Titular}
                              vencimiento={card.FechaVencimiento}
                              monto={card.Monto}
                              isSelected={selectedCardId === card.documentId}
                              onSelect={() => {
                                setSelectedCardId(card.documentId);
                                setPaymentMethod(card.documentId);
                                setSelectedCard(card);
                              }}
                            />
                          </div>
                        ))
                    )}
                  </div>

                  {cards.length > 0 && cards.filter(card => card.Monto >= total).length === 0 && (
                    <div className="w-full text-center py-4">
                      <p className="text-red-500">
                        No tienes tarjetas con saldo suficiente para este pago (${total.toLocaleString('es-CO')})
                      </p>
                      <button 
                        onClick={() => router.push('/router/mis-tarjetas')}
                        className="mt-2 text-orange-500 hover:text-orange-600 underline"
                      >
                        Agregar más saldo a tus tarjetas
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-6">
                    <p className="font-semibold">Total a Pagar: ${total.toLocaleString('es-CO')}</p>
                    {currentStep === 3 && (
                      <button
                        onClick={handlePayment}
                        disabled={!selectedCardId || cards.filter(card => card.Monto >= total).length === 0}
                        className={`px-6 py-2 rounded-md text-white ${
                          selectedCardId && cards.filter(card => card.Monto >= total).length > 0 
                            ? 'bg-orange-500 hover:bg-orange-600' 
                            : 'bg-gray-400 cursor-not-allowed'
                        } transition`}
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