# ChainAware - Demostración Interactiva

## 🎯 Objetivo de la Demostración

Esta demostración muestra las capacidades principales de **ChainAware**, un sistema de trazabilidad inteligente que utiliza GenLayer para crear contratos inteligentes con IA. Veremos cómo el sistema puede:

1. **Registrar productos** con verificación automática usando IA
2. **Rastrear ubicaciones** en tiempo real con análisis de riesgos
3. **Predecir problemas** antes de que ocurran
4. **Procesar consultas** en lenguaje natural
5. **Generar alertas** inteligentes

## 📊 Datos de Demostración

### Productos Registrados
```json
{
  "products": [
    {
      "id": "BTC2025A001",
      "name": "Vacuna COVID-19",
      "category": "pharmaceuticals",
      "manufacturer": "BioTech Corp",
      "origin": "Alemania",
      "batch_number": "BTC-2025-001",
      "regulatory_codes": ["FDA-12345", "EU-GMP-67890"],
      "specifications": {
        "temperature_requirement": "2-8°C",
        "humidity_max": 65,
        "storage_class": "A"
      },
      "sensors_config": {
        "temperature_sensor": true,
        "humidity_sensor": true,
        "gps_tracker": true
      }
    },
    {
      "id": "AF2025B002",
      "name": "Productos Frescos A",
      "category": "food",
      "manufacturer": "AgriFresh Ltd",
      "origin": "España",
      "batch_number": "AF-2025-1107",
      "regulatory_codes": ["EU-FOOD-2025"],
      "specifications": {
        "temperature_requirement": "0-4°C",
        "humidity_max": 80
      },
      "sensors_config": {
        "temperature_sensor": true,
        "gps_tracker": true
      }
    }
  ]
}
```

### Rutas de Demostración

#### Producto 1: Vacuna COVID-19
```
📍 Origen: Berlín, Alemania (52.5200, 13.4050)
🛣️ Ruta: Berlín → París → Madrid → Barcelona
📅 Tiempo estimado: 3 días
🌡️ Temperatura mantenida: 4°C
⚠️  Alertas: Ninguna
```

#### Producto 2: Productos Frescos
```
📍 Origen: Valencia, España (39.4699, -0.3763)
🛣️ Ruta: Valencia → Barcelona → Milán → Múnich
📅 Tiempo estimado: 2 días
🌡️ Temperatura actual: 25°C (⚠️  ALTO RIESGO)
⚠️  Alertas: 2 (Temperatura, Retraso)
```

## 🔍 Consultas de Demostración

### 1. Consultas en Lenguaje Natural

Prueba estas consultas en el dashboard:

```
✅ "¿Dónde está mi vacuna COVID-19?"
✅ "Muestra productos en riesgo alto"
✅ "¿Qué alertas tengo pendientes?"
✅ "Cuántos productos hay en tránsito"
✅ "Verifica documentos del lote BTC-2025-001"
```

### 2. Simulación de Eventos

#### Evento 1: Registro de Producto
```python
# Registrar nuevo producto farmacéutico
product_data = {
    "name": "Medicamento X",
    "category": "pharmaceuticals",
    "origin": "Suiza",
    "manufacturer": "PharmaSwiss",
    "production_date": "2025-11-07T09:00:00Z",
    "batch_number": "PS-2025-1107",
    "regulatory_codes": ["SWISS-MED-2025"],
    "sensors_config": {"temperature_sensor": True, "gps_tracker": True}
}

product_id = await contract.register_product(product_data)
print(f"Producto registrado: {product_id}")
```

#### Evento 2: Actualización de Ubicación
```python
# Simular actualización de ubicación con datos IoT
location_update = {
    "latitude": 48.8566,  # París
    "longitude": 2.3522,
    "timestamp": "2025-11-07T15:00:00Z",
    "temperature": 6.5,  # Dentro del rango acceptable
    "humidity": 70
}

await contract.update_location(product_id, location_update)
print("Ubicación actualizada con análisis de riesgos")
```

#### Evento 3: Predicción de Riesgos
```python
# Predecir riesgos de entrega
destination = {"latitude": 41.3851, "longitude": 2.1734}  # Barcelona

risk_prediction = await contract.predict_delivery_risks(product_id, destination)
print(f"Nivel de riesgo: {risk_prediction.level.value}")
print(f"Confianza: {risk_prediction.confidence:.2%}")
print(f"Recomendación: {risk_prediction.recommendation}")
```

#### Evento 4: Verificación de Documentos
```python
# Verificar certificado de origen
document = {
    "type": "certificate_of_origin",
    "product": "Medicamento X",
    "origin": "Suiza",
    "issuer": "Swiss Health Authority",
    "date": "2025-11-07",
    "certificate_number": "CH-2025-MED-123456"
}

verification = await contract.verify_document(document)
print(f"Documento verificado: {verification['verified']}")
print(f"Score de fraude: {verification['fraud_score']:.2%}")
```

## 📈 Métricas de Demostración

### Dashboard Principal
```
📊 Métricas en Tiempo Real:
  • Productos Registrados: 1,247 (+12% esta semana)
  • Alertas Activas: 23 (+3 desde ayer)
  • En Tránsito: 89 (Sin cambios)
  • Predicciones IA: 156 (+45% precisión)
```

### Análisis de Riesgos
```
🔴 Críticas: 0 productos
🟡 Altas: 5 productos
🟢 Medias: 12 productos
✅ Bajas: 1,230 productos
```

### Eficiencia del Sistema
```
🎯 Precisión de Alertas: 94.2%
⚡ Tiempo de Respuesta: 1.3s
🔄 Disponibilidad: 99.9%
🤖 Precisión IA: 96%
```

## 🎮 Escenarios de Demostración

### Escenario 1: Alerta de Temperatura
1. **Ubicación**: Madrid, España
2. **Producto**: Vacuna COVID-19
3. **Problema**: Temperatura de 45°C (límite: 8°C)
4. **Respuesta IA**: 
   - ✅ Alerta crítica generada automáticamente
   - 📱 Notificación enviada a responsables
   - 🗺️ Ruta alternativa propuesta
   - 📊 Riesgo de calidad actualizado

### Escenario 2: Predicción de Retraso
1. **Condiciones**: Lluvia intensa en París
2. **Producto**: Productos Frescos
3. **Predicción IA**:
   - ⚠️ Retraso probable: 4-6 horas
   - 🛣️ Ruta alternativa disponible
   - 💡 Recomendación: Cambiar transportista
4. **Resultado**: Retraso evitado exitosamente

### Escenario 3: Verificación de Documentos
1. **Documento**: Certificado de origen
2. **Análisis IA**:
   - ✅ Formato válido
   - ✅ Códigos regulatorios correctos
   - ✅ Firma digital verificada
   - ✅ Score de fraude: 2%
3. **Resultado**: Documento aprobado automáticamente

## 🔧 Cómo Ejecutar la Demostración

### 1. Iniciar la Aplicación
```bash
# Instalar dependencias
npm install
pip install -r requirements.txt

# Iniciar servicios
npm run dev
python deploy.py
```

### 2. Interactuar con el Dashboard

#### Navegación:
- **Dashboard**: Vista principal con métricas y mapa
- **Productos**: Gestión y seguimiento de productos
- **Alertas**: Centro de notificaciones inteligentes
- **Análisis**: Insights y predicciones de IA

#### Funcionalidades Clave:
1. **Consulta en Lenguaje Natural**:
   - Usa la barra de búsqueda en la parte superior
   - Prueba: "¿Dónde está mi vacuna?"
   
2. **Mapa Interactivo**:
   - Haz clic en los marcadores para ver detalles
   - Filtros por nivel de riesgo
   
3. **Gestión de Productos**:
   - Registra nuevos productos
   - Ve historial completo de trazabilidad
   
4. **Centro de Alertas**:
   - Filtra por tipo y nivel de riesgo
   - Reconoce y resuelve alertas

### 3. Simular Eventos

#### Usando la Consola del Navegador:
```javascript
// Registrar producto
registerProduct({
  name: "Producto Demo",
  category: "pharmaceuticals",
  origin: "Alemania",
  manufacturer: "BioTech Corp",
  production_date: "2025-11-07T10:00:00Z",
  batch_number: "DEMO-001"
});

// Actualizar ubicación
updateLocation("BTC2025A001", {
  latitude: 40.4168,
  longitude: -3.7038,
  temperature: 25.0,
  timestamp: "2025-11-07T15:00:00Z"
});

// Generar consulta
processNaturalQuery("¿Hay alertas activas?");
```

## 📝 Logs de Demostración

### Log del Sistema
```
[2025-11-07 15:30:15] INFO: Producto registrado - ID: BTC2025A001
[2025-11-07 15:30:16] INFO: Verificación regulatoria completada
[2025-11-07 15:30:17] INFO: Análisis de riesgos inicializado
[2025-11-07 15:31:45] INFO: Ubicación actualizada - Madrid, España
[2025-11-07 15:31:46] WARN: Temperatura alta detectada (25°C)
[2025-11-07 15:31:47] INFO: Alerta generada automáticamente
[2025-11-07 15:32:10] INFO: Consulta NLP procesada: "¿Dónde está mi producto?"
[2025-11-07 15:32:11] INFO: Respuesta generada por IA
```

### Análisis de IA
```
🧠 ANÁLISIS DE RIESGO - Producto BTC2025A001
┌─────────────────────────────────────────────┐
│ Factores de Riesgo:                        │
│ • Temperatura elevada para farmacéuticos    │
│ • Posible degradación de efectividad       │
│                                             │
│ Recomendación:                              │
│ • Monitorear temperatura cada 15 min       │
│ • Considerar transporte refrigerado        │
│ • Notificar al fabricante                  │
│                                             │
│ Confianza: 94.2%                           │
│ Nivel: MEDIO                               │
└─────────────────────────────────────────────┘
```

## 🎯 Objetivos de Aprendizaje

Al final de esta demostración, deberías entender:

1. **Cómo funciona la trazabilidad inteligente** con contratos GenLayer
2. **Capacidades de IA** para predicción y análisis de riesgos
3. **Procesamiento de lenguaje natural** para consultas intuitivas
4. **Verificación automática** de documentos y cumplimiento
5. **Integración de datos** de múltiples fuentes (IoT, APIs, blockchain)

## 🚀 Próximos Pasos

1. **Explora el código fuente** en `/contracts/chainaware_traceability.py`
2. **Modifica la configuración** en `/config/genlayer.conf`
3. **Añade nuevos sensores** IoT al sistema
4. **Integra APIs adicionales** (meteorología, tráfico, regulatory)
5. **Despliega en mainnet** de GenLayer

---

**¡Disfruta explorando ChainAware!** 🚀

*Para soporte técnico o preguntas, visita: https://discord.gg/chainaware*