// ChainAware - Sistema de Trazabilidad Inteligente
// Aplicación principal con Vue.js y integración GenLayer

import { createApp, ref, reactive, onMounted } from 'vue'
import { createPinia } from 'pinia'

// Inicializar Lucide icons
lucide.createIcons()

// Pinia store para manejo de estado
const useChainAwareStore = defineStore('chainaware', () => {
  // Estado reactivo
  const products = ref([])
  const alerts = ref([])
  const currentSection = ref('dashboard')
  const isLoading = ref(true)
  const map = ref(null)
  const riskChart = ref(null)
  const traceChart = ref(null)
  const categoryChart = ref(null)
  const aiChart = ref(null)
  
  // Datos simulados
  const mockData = {
    metrics: {
      totalProducts: 1247,
      activeAlerts: 23,
      inTransit: 89,
      aiPredictions: 156
    },
    recentActivity: [
      {
        id: 1,
        type: 'product_registered',
        icon: 'Package',
        iconColor: 'success',
        title: 'Producto Registrado',
        description: 'Vacuna COVID-19 - Lote BTC-2025-1107',
        time: '2 min ago'
      },
      {
        id: 2,
        type: 'alert_triggered',
        icon: 'AlertTriangle',
        iconColor: 'warning',
        title: 'Alerta de Temperatura',
        description: 'Producto farmacéutico fuera de rango (45°C)',
        time: '5 min ago'
      },
      {
        id: 3,
        type: 'prediction_updated',
        icon: 'Brain',
        iconColor: 'primary',
        title: 'Predicción de IA Actualizada',
        description: 'Riesgo de retraso en 3 envíos detectado',
        time: '8 min ago'
      }
    ],
    products: [
      {
        id: 'BTC2025A001',
        name: 'Vacuna COVID-19',
        category: 'pharmaceuticals',
        manufacturer: 'BioTech Corp',
        status: 'in_transit',
        risk: 'low',
        lastUpdate: '2025-11-07T15:30:00Z'
      },
      {
        id: 'AF2025B002',
        name: 'Productos Frescos A',
        category: 'food',
        manufacturer: 'AgriFresh Ltd',
        status: 'in_transit',
        risk: 'high',
        lastUpdate: '2025-11-07T15:25:00Z'
      }
    ]
  }
  
  // Acciones
  const loadData = async () => {
    try {
      // Simular carga de datos desde la blockchain
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      products.value = mockData.products
      alerts.value = []
      
      isLoading.value = false
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }
  
  const switchSection = (section) => {
    currentSection.value = section
    
    // Actualizar navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active')
      if (btn.dataset.section === section) {
        btn.classList.add('active')
      }
    })
    
    // Mostrar/ocultar secciones
    document.querySelectorAll('.content-section').forEach(sec => {
      sec.classList.remove('active')
    })
    document.getElementById(`${section}-section`).classList.add('active')
    
    // Inicializar componentes específicos de la sección
    if (section === 'dashboard') {
      initializeDashboard()
    } else if (section === 'products') {
      initializeProducts()
    } else if (section === 'alerts') {
      initializeAlerts()
    } else if (section === 'analytics') {
      initializeAnalytics()
    }
  }
  
  const initializeDashboard = () => {
    setTimeout(() => {
      initializeMap()
      initializeRiskChart()
      updateMetrics()
    }, 100)
  }
  
  const initializeMap = () => {
    if (!map.value && document.getElementById('leaflet-map')) {
      // Inicializar mapa con Leaflet
      map.value = L.map('leaflet-map').setView([40.4168, -3.7038], 6)
      
      // Tema oscuro para el mapa
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map.value)
      
      // Agregar marcadores de productos
      addProductMarkers()
    }
  }
  
  const addProductMarkers = () => {
    if (!map.value) return
    
    // Marcadores simulados
    const markers = [
      { lat: 40.4168, lng: -3.7038, product: 'Vacuna COVID-19', risk: 'low' },
      { lat: 51.5074, lng: -0.1278, product: 'Productos Frescos A', risk: 'high' },
      { lat: 48.8566, lng: 2.3522, product: 'Componente Electrónico B', risk: 'medium' },
      { lat: 52.5200, lng: 13.4050, product: 'Producto Textil C', risk: 'low' }
    ]
    
    markers.forEach(marker => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-dot ${marker.risk}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
      
      L.marker([marker.lat, marker.lng], { icon: icon })
        .addTo(map.value)
        .bindPopup(`
          <div style="color: #E4E4E7; background: #141414; padding: 12px; border-radius: 8px;">
            <h4 style="margin: 0 0 8px 0; color: #00E0FF;">${marker.product}</h4>
            <p style="margin: 0; color: #A1A1AA;">Riesgo: <span style="color: ${getRiskColor(marker.risk)}">${marker.risk.toUpperCase()}</span></p>
            <button onclick="showProductDetails('${marker.product}')" 
                    style="margin-top: 8px; background: #00E0FF; color: #0A0A0A; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
              Ver Detalles
            </button>
          </div>
        `)
    })
  }
  
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return '#22C55E'
      case 'medium': return '#FACC15'
      case 'high': return '#EF4444'
      default: return '#A1A1AA'
    }
  }
  
  const initializeRiskChart = () => {
    if (!riskChart.value && document.getElementById('risk-chart')) {
      const ctx = document.getElementById('risk-chart').getContext('2d')
      
      riskChart.value = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Bajo', 'Medio', 'Alto', 'Crítico'],
          datasets: [{
            data: [1230, 12, 5, 0],
            backgroundColor: [
              '#22C55E',
              '#FACC15',
              '#EF4444',
              '#DC2626'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#E4E4E7',
                usePointStyle: true,
                padding: 20
              }
            }
          }
        }
      })
    }
  }
  
  const updateMetrics = () => {
    // Actualizar métricas con datos simulados
    document.getElementById('total-products').textContent = mockData.metrics.totalProducts.toLocaleString()
    document.getElementById('active-alerts').textContent = mockData.metrics.activeAlerts
    document.getElementById('in-transit').textContent = mockData.metrics.inTransit
    document.getElementById('ai-predictions').textContent = mockData.metrics.aiPredictions
    
    // Actualizar actividad reciente
    updateRecentActivity()
  }
  
  const updateRecentActivity = () => {
    const activityList = document.getElementById('activity-list')
    if (activityList) {
      activityList.innerHTML = mockData.recentActivity.map(activity => `
        <div class="activity-item">
          <div class="activity-icon" style="background: ${getIconColor(activity.iconColor)}20; color: ${getIconColor(activity.iconColor)}">
            <i data-lucide="${activity.icon}" style="width: 20px; height: 20px;"></i>
          </div>
          <div class="activity-content">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-description">${activity.description}</div>
            <div class="activity-time">${activity.time}</div>
          </div>
        </div>
      `).join('')
      
      // Re-inicializar iconos
      lucide.createIcons()
    }
  }
  
  const getIconColor = (color) => {
    switch(color) {
      case 'success': return '#22C55E'
      case 'warning': return '#FACC15'
      case 'primary': return '#00E0FF'
      default: return '#A1A1AA'
    }
  }
  
  const initializeProducts = () => {
    setTimeout(() => {
      updateProductsTable()
    }, 100)
  }
  
  const updateProductsTable = () => {
    const tbody = document.getElementById('products-table-body')
    if (tbody) {
      tbody.innerHTML = products.value.map(product => `
        <tr onclick="showProductModal('${product.id}')" style="cursor: pointer;">
          <td style="font-family: var(--font-mono); font-size: 0.875rem;">${product.id}</td>
          <td>${product.name}</td>
          <td>${getCategoryName(product.category)}</td>
          <td>${product.manufacturer}</td>
          <td>
            <span class="status-badge ${product.status === 'in_transit' ? 'active' : 'inactive'}">
              ${getStatusName(product.status)}
            </span>
          </td>
          <td>
            <span class="risk-badge ${product.risk}">${product.risk.toUpperCase()}</span>
          </td>
          <td style="font-family: var(--font-mono); font-size: 0.875rem;">
            ${new Date(product.lastUpdate).toLocaleString()}
          </td>
          <td>
            <button class="alert-action-btn" onclick="event.stopPropagation(); trackProduct('${product.id}')">
              <i data-lucide="map-pin" style="width: 16px; height: 16px;"></i>
            </button>
            <button class="alert-action-btn" onclick="event.stopPropagation(); showProductDetails('${product.id}')">
              <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
            </button>
          </td>
        </tr>
      `).join('')
      
      // Re-inicializar iconos
      lucide.createIcons()
    }
  }
  
  const getCategoryName = (category) => {
    const categories = {
      'pharmaceuticals': 'Farmacéutico',
      'food': 'Alimentario',
      'electronics': 'Electrónico',
      'textiles': 'Textil'
    }
    return categories[category] || category
  }
  
  const getStatusName = (status) => {
    const statuses = {
      'in_transit': 'En Tránsito',
      'delivered': 'Entregado',
      'at_warehouse': 'En Almacén'
    }
    return statuses[status] || status
  }
  
  const initializeAlerts = () => {
    setTimeout(() => {
      generateMockAlerts()
    }, 100)
  }
  
  const generateMockAlerts = () => {
    const mockAlerts = [
      {
        id: 'ALT001',
        type: 'temperature_deviation',
        level: 'critical',
        message: 'Producto farmacéutico detectado con temperatura de 45°C (máximo: 8°C)',
        product: 'Vacuna COVID-19 - Lote BTC-2025-1107',
        location: 'Madrid, España',
        time: '5 min ago'
      },
      {
        id: 'ALT002',
        type: 'route_deviation',
        level: 'high',
        message: 'Desviación de ruta detectada para productos frescos',
        product: 'Productos Frescos A - Lote AF-2025-1107',
        location: 'París, Francia',
        time: '12 min ago'
      }
    ]
    
    const container = document.getElementById('alerts-container')
    if (container) {
      container.innerHTML = mockAlerts.map(alert => `
        <div class="alert-card ${alert.level}">
          <div class="alert-header">
            <div class="alert-type">
              <i data-lucide="${getAlertIcon(alert.type)}" style="width: 20px; height: 20px;"></i>
              ${getAlertTypeName(alert.type)}
            </div>
            <div class="alert-level ${alert.level}">
              ${alert.level.toUpperCase()}
            </div>
          </div>
          <div class="alert-message">${alert.message}</div>
          <div class="alert-details">
            <span><strong>Producto:</strong> ${alert.product}</span>
            <span><strong>Ubicación:</strong> ${alert.location}</span>
            <span><strong>Tiempo:</strong> ${alert.time}</span>
          </div>
          <div class="alert-actions">
            <button class="alert-action-btn" onclick="acknowledgeAlert('${alert.id}')">
              <i data-lucide="check" style="width: 16px; height: 16px;"></i>
              Reconocer
            </button>
            <button class="alert-action-btn" onclick="resolveAlert('${alert.id}')">
              <i data-lucide="check-check" style="width: 16px; height: 16px;"></i>
              Resolver
            </button>
          </div>
        </div>
      `).join('')
      
      // Re-inicializar iconos
      lucide.createIcons()
    }
  }
  
  const getAlertIcon = (type) => {
    const icons = {
      'temperature_deviation': 'thermometer',
      'route_deviation': 'map-pin',
      'delay_prediction': 'clock',
      'quality_risk': 'alert-triangle',
      'security_breach': 'shield-alert'
    }
    return icons[type] || 'alert-triangle'
  }
  
  const getAlertTypeName = (type) => {
    const types = {
      'temperature_deviation': 'Desviación de Temperatura',
      'route_deviation': 'Desviación de Ruta',
      'delay_prediction': 'Predicción de Retraso',
      'quality_risk': 'Riesgo de Calidad',
      'security_breach': 'Brecha de Seguridad'
    }
    return types[type] || type
  }
  
  const initializeAnalytics = () => {
    setTimeout(() => {
      initializeTraceChart()
      initializeCategoryChart()
      initializeAIChart()
    }, 100)
  }
  
  const initializeTraceChart = () => {
    if (!traceChart.value && document.getElementById('traceability-trends-chart')) {
      const ctx = document.getElementById('traceability-trends-chart').getContext('2d')
      
      traceChart.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Productos Registrados',
            data: [120, 190, 300, 500, 200, 300, 450],
            borderColor: '#00E0FF',
            backgroundColor: 'rgba(0, 224, 255, 0.1)',
            fill: true,
            tension: 0.4
          }, {
            label: 'Alertas Generadas',
            data: [5, 12, 8, 15, 6, 9, 11],
            borderColor: '#FACC15',
            backgroundColor: 'rgba(250, 204, 21, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#E4E4E7'
              }
            }
          },
          scales: {
            y: {
              ticks: { color: '#A1A1AA' },
              grid: { color: '#3F3F46' }
            },
            x: {
              ticks: { color: '#A1A1AA' },
              grid: { color: '#3F3F46' }
            }
          }
        }
      })
    }
  }
  
  const initializeCategoryChart = () => {
    if (!categoryChart.value && document.getElementById('category-distribution-chart')) {
      const ctx = document.getElementById('category-distribution-chart').getContext('2d')
      
      categoryChart.value = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Farmacéutico', 'Alimentario', 'Electrónico', 'Textil', 'Otros'],
          datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              '#00E0FF',
              '#22C55E',
              '#FACC15',
              '#EF4444',
              '#A1A1AA'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#E4E4E7',
                usePointStyle: true
              }
            }
          }
        }
      })
    }
  }
  
  const initializeAIChart = () => {
    if (!aiChart.value && document.getElementById('ai-predictions-chart')) {
      const ctx = document.getElementById('ai-predictions-chart').getContext('2d')
      
      aiChart.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Predicciones de Retraso', 'Riesgos de Calidad', 'Optimización de Rutas', 'Detección de Anomalías', 'Análisis de Patrones'],
          datasets: [{
            label: 'Precisión (%)',
            data: [94, 89, 92, 96, 88],
            backgroundColor: [
              '#00E0FF',
              '#22C55E',
              '#FACC15',
              '#EF4444',
              '#00A8C7'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#E4E4E7'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { 
                color: '#A1A1AA',
                callback: function(value) {
                  return value + '%'
                }
              },
              grid: { color: '#3F3F46' }
            },
            x: {
              ticks: { color: '#A1A1AA' },
              grid: { color: '#3F3F46' }
            }
          }
        }
      })
    }
  }
  
  return {
    products,
    alerts,
    currentSection,
    isLoading,
    map,
    loadData,
    switchSection,
    initializeDashboard,
    initializeProducts,
    initializeAlerts,
    initializeAnalytics
  }
})

// Función global para mostrar detalles del producto
window.showProductDetails = (productId) => {
  const product = mockData.products.find(p => p.id === productId)
  if (product) {
    // Cambiar a sección de productos
    store.switchSection('products')
    
    // Mostrar modal con detalles
    showProductModal(productId)
  }
}

// Función global para mostrar modal de producto
window.showProductModal = (productId) => {
  const product = mockData.products.find(p => p.id === productId)
  if (!product) return
  
  const modal = document.getElementById('product-modal')
  const modalBody = document.getElementById('product-modal-body')
  
  modalBody.innerHTML = `
    <div class="product-details">
      <h4 style="color: #00E0FF; margin-bottom: 16px;">${product.name}</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div>
          <strong style="color: #E4E4E7;">ID:</strong>
          <span style="font-family: var(--font-mono); color: #A1A1AA;">${product.id}</span>
        </div>
        <div>
          <strong style="color: #E4E4E7;">Categoría:</strong>
          <span style="color: #A1A1AA;">${getCategoryName(product.category)}</span>
        </div>
        <div>
          <strong style="color: #E4E4E7;">Fabricante:</strong>
          <span style="color: #A1AA;">${product.manufacturer}</span>
        </div>
        <div>
          <strong style="color: #E4E4E7;">Estado:</strong>
          <span class="status-badge ${product.status === 'in_transit' ? 'active' : 'inactive'}">
            ${getStatusName(product.status)}
          </span>
        </div>
        <div>
          <strong style="color: #E4E4E7;">Nivel de Riesgo:</strong>
          <span class="risk-badge ${product.risk}">${product.risk.toUpperCase()}</span>
        </div>
        <div>
          <strong style="color: #E4E4E7;">Última Actualización:</strong>
          <span style="color: #A1A1AA; font-family: var(--font-mono);">
            ${new Date(product.lastUpdate).toLocaleString()}
          </span>
        </div>
      </div>
      
      <div style="margin-top: 24px;">
        <h5 style="color: #E4E4E7; margin-bottom: 12px;">Historial de Trazabilidad</h5>
        <div style="background: rgba(63, 63, 70, 0.2); padding: 16px; border-radius: 8px;">
          <p style="color: #A1A1AA; margin: 0;">Iniciando historial de ubicación y eventos...</p>
        </div>
      </div>
    </div>
  `
  
  modal.style.display = 'flex'
  
  // Cerrar modal al hacer clic fuera
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none'
    }
  }
  
  // Botón de cerrar
  modal.querySelector('.modal-close').onclick = () => {
    modal.style.display = 'none'
  }
}

// Función para rastrear producto
window.trackProduct = (productId) => {
  // Cambiar a dashboard
  store.switchSection('dashboard')
  
  // Simular centrado en el producto en el mapa
  setTimeout(() => {
    if (store.map) {
      // Simular movimiento del mapa (en implementación real, centrar en la ubicación del producto)
      store.map.setView([40.4168, -3.7038], 10)
    }
  }, 500)
}

// Función para reconocer alerta
window.acknowledgeAlert = (alertId) => {
  console.log('Alert acknowledged:', alertId)
  // Implementar lógica de reconocimiento de alerta
}

// Función para resolver alerta
window.resolveAlert = (alertId) => {
  console.log('Alert resolved:', alertId)
  // Implementar lógica de resolución de alerta
}

// Función para procesar consultas en lenguaje natural
window.processNaturalQuery = async (query) => {
  if (!query.trim()) return
  
  console.log('Processing query:', query)
  
  // Simular procesamiento con IA
  const queryLower = query.toLowerCase()
  
  let response = ""
  
  if (queryLower.includes('producto') || queryLower.includes('product')) {
    if (queryLower.includes('riesgo') || queryLower.includes('risk')) {
      response = "He encontrado 5 productos con riesgo alto que requieren atención inmediata. ¿Deseas ver los detalles?"
    } else {
      response = `Actualmente tienes ${mockData.metrics.totalProducts} productos registrados en el sistema.`
    }
  } else if (queryLower.includes('alerta') || queryLower.includes('alert')) {
    response = `Hay ${mockData.metrics.activeAlerts} alertas activas en el sistema. 3 son críticas y requieren atención inmediata.`
  } else if (queryLower.includes('ubicación') || queryLower.includes('location')) {
    response = "89 productos están actualmente en tránsito. ¿Te gustaría ver una ruta específica?"
  } else {
    response = "Puedo ayudarte con información sobre productos, alertas, ubicaciones y análisis de riesgo. ¿Qué te gustaría saber?"
  }
  
  // Mostrar respuesta (en implementación real, esto se integraría con el contrato inteligente)
  showQueryResponse(response)
}

const showQueryResponse = (response) => {
  // Crear elemento de respuesta
  const responseDiv = document.createElement('div')
  responseDiv.className = 'query-response'
  responseDiv.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(0, 224, 255, 0.3);
    border-radius: 12px;
    padding: 16px;
    max-width: 400px;
    color: #E4E4E7;
    box-shadow: 0 0 24px 0 rgba(0, 224, 255, 0.25);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `
  
  responseDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
      <i data-lucide="brain" style="color: #00E0FF; width: 20px; height: 20px;"></i>
      <strong style="color: #00E0FF;">ChainAware AI</strong>
    </div>
    <p style="margin: 0; line-height: 1.4;">${response}</p>
  `
  
  document.body.appendChild(responseDiv)
  
  // Re-inicializar iconos
  lucide.createIcons()
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    responseDiv.style.animation = 'slideOut 0.3s ease-in'
    setTimeout(() => {
      document.body.removeChild(responseDiv)
    }, 300)
  }, 5000)
}

// Inicializar aplicación
const store = useChainAwareStore()

// Vue app
const app = createApp({
  setup() {
    const loading = ref(true)
    
    onMounted(async () => {
      // Simular tiempo de carga
      await store.loadData()
      
      // Ocultar loading screen
      setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none'
        document.getElementById('main-app').style.display = 'block'
        
        // Inicializar dashboard por defecto
        store.initializeDashboard()
      }, 1000)
    })
    
    return {
      loading,
      store
    }
  }
})

// Configurar Pinia
app.use(createPinia())

// Montar aplicación
app.mount('#app')

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Navegación
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.switchSection(btn.dataset.section)
    })
  })
  
  // Botón registrar producto
  document.getElementById('register-product-btn')?.addEventListener('click', () => {
    store.switchSection('products')
    // Scroll al formulario
    setTimeout(() => {
      document.querySelector('.product-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  })
  
  // Consulta en lenguaje natural
  const queryInput = document.getElementById('natural-query')
  const queryBtn = document.getElementById('execute-query')
  
  if (queryBtn) {
    queryBtn.addEventListener('click', () => {
      const query = queryInput?.value || ''
      if (query.trim()) {
        window.processNaturalQuery(query)
        if (queryInput) queryInput.value = ''
      }
    })
  }
  
  if (queryInput) {
    queryInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        queryBtn?.click()
      }
    })
  }
  
  // Sugerencias de consultas
  document.querySelectorAll('.suggestion-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const query = tag.textContent.replace('Intenta: ', '').replace(/"/g, '')
      queryInput.value = query
      queryBtn.click()
    })
  })
  
  // Formulario de registro de producto
  const productForm = document.getElementById('product-registration-form')
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault()
      
      // Simular registro de producto
      const formData = new FormData(productForm)
      const productData = Object.fromEntries(formData)
      
      console.log('Registering product:', productData)
      
      // Mostrar confirmación
      showQueryResponse('Producto registrado exitosamente. El sistema de IA está verificando la información...')
      
      // Resetear formulario
      productForm.reset()
    })
  }
})

// CSS para animaciones adicionales
const additionalStyles = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .custom-marker {
    background: transparent;
    border: none;
  }
  
  .marker-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(0, 224, 255, 0.3);
    animation: pulse 2s infinite;
  }
  
  .marker-dot.low {
    background: #22C55E;
  }
  
  .marker-dot.medium {
    background: #FACC15;
  }
  
  .marker-dot.high {
    background: #EF4444;
  }
  
  .marker-dot.critical {
    background: #DC2626;
    animation: pulse 1s infinite;
  }
`

// Inyectar estilos adicionales
const styleSheet = document.createElement('style')
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)