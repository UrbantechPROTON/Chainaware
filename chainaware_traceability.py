"""
ChainAware - Intelligent Traceability System
============================================

Advanced traceability contract using GenLayer's intelligent capabilities
to create a predictive, self-regulating supply chain ecosystem.
"""

from genlayer import *
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
from enum import Enum
import json
import re
import hashlib
from dataclasses import dataclass

class ProductStatus(Enum):
    """Product status tracking"""
    MANUFACTURED = "manufactured"
    IN_TRANSIT = "in_transit"
    AT_WAREHOUSE = "at_warehouse"
    IN_STOCK = "in_stock"
    DELIVERED = "delivered"
    RECALLED = "recalled"
    DISPOSED = "disposed"

class RiskLevel(Enum):
    """Risk assessment levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertType(Enum):
    """Alert types for intelligent monitoring"""
    TEMPERATURE_DEVIATION = "temperature_deviation"
    ROUTE_DEVIATION = "route_deviation"
    DELAY_PREDICTION = "delay_prediction"
    QUALITY_RISK = "quality_risk"
    SECURITY_BREACH = "security_breach"
    REGULATORY_VIOLATION = "regulatory_violation"

@dataclass
class ProductData:
    """Product information structure"""
    id: str
    name: str
    category: str
    origin: str
    manufacturer: str
    production_date: datetime
    batch_number: str
    specifications: Dict[str, Any]
    regulatory_codes: List[str]
    sensors_config: Dict[str, Any]

@dataclass
class LocationData:
    """Location and movement data"""
    latitude: float
    longitude: float
    timestamp: datetime
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    shock_level: Optional[float] = None

@dataclass
class RiskPrediction:
    """AI-generated risk assessment"""
    level: RiskLevel
    factors: List[str]
    confidence: float
    recommendation: str
    predicted_time: datetime

@dataclass
class Alert:
    """Intelligent alert system"""
    id: str
    type: AlertType
    level: RiskLevel
    message: str
    location: LocationData
    timestamp: datetime
    acknowledged: bool = False
    resolution: Optional[str] = None

@intelligent_contract
class ChainAwareTraceability:
    """
    Intelligent Traceability System powered by GenLayer AI capabilities
    """
    
    def __init__(self):
        self.products: Dict[str, ProductData] = {}
        self.locations: Dict[str, List[LocationData]] = {}
        self.alerts: List[Alert] = []
        self.risk_models: Dict[str, Any] = {}
        self.regulatory_apis = {}
        self.weather_api_key = None
        self.traffic_api_key = None
        
    async def initialize_system(self, weather_api: str = None, traffic_api: str = None):
        """Initialize external API connections and risk models"""
        self.weather_api_key = weather_api
        self.traffic_api_key = traffic_api
        
        # Initialize AI risk prediction models
        await self._load_risk_models()
        
        # Setup regulatory API connections
        await self._setup_regulatory_apis()
        
        return "ChainAware Intelligent Traceability System initialized"
    
    async def register_product(self, product_data: Dict[str, Any]) -> str:
        """
        Register a new product with automatic verification using AI
        """
        try:
            # Validate product data using AI
            validation_result = await self._validate_product_data(product_data)
            if not validation_result["valid"]:
                raise Exception(f"Product validation failed: {validation_result['errors']}")
            
            # Generate unique product ID
            product_id = self._generate_product_id(product_data)
            
            # Store product information
            product = ProductData(
                id=product_id,
                name=product_data["name"],
                category=product_data["category"],
                origin=product_data["origin"],
                manufacturer=product_data["manufacturer"],
                production_date=datetime.fromisoformat(product_data["production_date"]),
                batch_number=product_data["batch_number"],
                specifications=product_data.get("specifications", {}),
                regulatory_codes=product_data.get("regulatory_codes", []),
                sensors_config=product_data.get("sensors_config", {})
            )
            
            self.products[product_id] = product
            
            # Auto-verify regulatory compliance
            compliance_check = await self._check_regulatory_compliance(product)
            
            # Log registration event
            await self._log_event("PRODUCT_REGISTERED", {
                "product_id": product_id,
                "name": product["name"],
                "compliance": compliance_check
            })
            
            # Trigger initial risk assessment
            await self._assess_initial_risks(product_id)
            
            return product_id
            
        except Exception as e:
            await self._log_event("REGISTRATION_ERROR", {"error": str(e)})
            raise Exception(f"Product registration failed: {str(e)}")
    
    async def update_location(self, product_id: str, location_data: Dict[str, Any]) -> bool:
        """
        Update product location with IoT sensor data
        """
        if product_id not in self.products:
            raise Exception("Product not found")
        
        # Parse location data
        location = LocationData(
            latitude=location_data["latitude"],
            longitude=location_data["longitude"],
            timestamp=datetime.fromisoformat(location_data["timestamp"]),
            temperature=location_data.get("temperature"),
            humidity=location_data.get("humidity"),
            pressure=location_data.get("pressure"),
            shock_level=location_data.get("shock_level")
        )
        
        # Store location data
        if product_id not in self.locations:
            self.locations[product_id] = []
        self.locations[product_id].append(location)
        
        # AI-powered analysis of current conditions
        risk_assessment = await self._analyze_current_risks(product_id, location)
        
        # Generate intelligent alerts if needed
        if risk_assessment.level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
            alert = Alert(
                id=self._generate_alert_id(),
                type=risk_assessment.factors[0] if risk_assessment.factors else AlertType.QUALITY_RISK,
                level=risk_assessment.level,
                message=f"Risk detected for {product_id}: {risk_assessment.recommendation}",
                location=location,
                timestamp=datetime.now(timezone.utc)
            )
            self.alerts.append(alert)
        
        # Log location update
        await self._log_event("LOCATION_UPDATED", {
            "product_id": product_id,
            "location": {"lat": location.latitude, "lng": location.longitude},
            "risk_level": risk_assessment.level.value
        })
        
        return True
    
    async def predict_delivery_risks(self, product_id: str, destination: Dict[str, float]) -> RiskPrediction:
        """
        AI-powered delivery risk prediction using real-time data
        """
        if product_id not in self.products:
            raise Exception("Product not found")
        
        # Get current location and route
        current_location = await self._get_latest_location(product_id)
        if not current_location:
            raise Exception("No location data available")
        
        # Fetch real-time external data
        weather_data = await self._get_weather_data(current_location, destination)
        traffic_data = await self._get_traffic_data(current_location, destination)
        
        # Use AI to analyze patterns and predict risks
        risk_factors = []
        confidence = 0.8
        
        # Weather-based risks
        if weather_data:
            if weather_data.get("severe_weather", False):
                risk_factors.append("severe_weather")
                confidence -= 0.2
            if weather_data.get("temperature_extreme"):
                risk_factors.append("temperature_extreme")
        
        # Traffic-based risks
        if traffic_data:
            if traffic_data.get("congestion_level", 0) > 0.7:
                risk_factors.append("heavy_traffic")
                confidence -= 0.15
        
        # Historical data analysis
        historical_risks = await self._analyze_historical_patterns(product_id)
        risk_factors.extend(historical_risks)
        
        # Determine risk level
        if len(risk_factors) >= 3 or confidence < 0.4:
            risk_level = RiskLevel.HIGH
            recommendation = "Consider alternative routes or delivery methods"
        elif len(risk_factors) >= 1 or confidence < 0.6:
            risk_level = RiskLevel.MEDIUM
            recommendation = "Monitor conditions closely and prepare contingency plans"
        else:
            risk_level = RiskLevel.LOW
            recommendation = "Standard delivery route appears safe"
        
        predicted_time = datetime.now(timezone.utc)  # Simplified for demo
        
        return RiskPrediction(
            level=risk_level,
            factors=risk_factors,
            confidence=confidence,
            recommendation=recommendation,
            predicted_time=predicted_time
        )
    
    async def verify_document(self, document_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI-powered document verification for certificates and compliance
        """
        # Simulate AI document analysis
        document_hash = hashlib.sha256(
            json.dumps(document_data, sort_keys=True).encode()
        ).hexdigest()
        
        # Check against regulatory databases
        regulatory_check = await self._verify_regulatory_database(document_data)
        
        # AI fraud detection
        fraud_score = await self._analyze_document_fraud_risk(document_data)
        
        # Generate verification result
        result = {
            "document_hash": document_hash,
            "verified": fraud_score < 0.3,  # Threshold for verification
            "fraud_score": fraud_score,
            "regulatory_status": regulatory_check,
            "verification_timestamp": datetime.now(timezone.utc).isoformat(),
            "issues": []
        }
        
        if fraud_score > 0.7:
            result["issues"].append("High fraud risk detected")
        if not regulatory_check.get("valid", False):
            result["issues"].append("Regulatory verification failed")
        
        # Log verification
        await self._log_event("DOCUMENT_VERIFIED", result)
        
        return result
    
    async def get_product_traceability(self, product_id: str) -> Dict[str, Any]:
        """
        Get complete product traceability data
        """
        if product_id not in self.products:
            raise Exception("Product not found")
        
        product = self.products[product_id]
        locations = self.locations.get(product_id, [])
        
        # Get related alerts
        product_alerts = [alert for alert in self.alerts if alert.id.startswith(product_id)]
        
        # Get current risk assessment
        current_risk = await self._get_current_risk_assessment(product_id)
        
        return {
            "product": {
                "id": product.id,
                "name": product.name,
                "category": product.category,
                "origin": product.origin,
                "manufacturer": product.manufacturer,
                "production_date": product.production_date.isoformat(),
                "batch_number": product.batch_number,
                "specifications": product.specifications,
                "regulatory_codes": product.regulatory_codes
            },
            "location_history": [
                {
                    "latitude": loc.latitude,
                    "longitude": loc.longitude,
                    "timestamp": loc.timestamp.isoformat(),
                    "temperature": loc.temperature,
                    "humidity": loc.humidity,
                    "pressure": loc.pressure,
                    "shock_level": loc.shock_level
                }
                for loc in locations
            ],
            "alerts": [
                {
                    "id": alert.id,
                    "type": alert.type.value,
                    "level": alert.level.value,
                    "message": alert.message,
                    "timestamp": alert.timestamp.isoformat(),
                    "acknowledged": alert.acknowledged
                }
                for alert in product_alerts
            ],
            "current_risk": {
                "level": current_risk.level.value,
                "factors": current_risk.factors,
                "confidence": current_risk.confidence,
                "recommendation": current_risk.recommendation
            } if current_risk else None,
            "traceability_score": await self._calculate_traceability_score(product_id)
        }
    
    async def query_natural_language(self, query: str) -> Dict[str, Any]:
        """
        Process natural language queries about products and shipments
        """
        # AI-powered query interpretation
        intent = await self._interpret_query_intent(query)
        
        if intent["type"] == "PRODUCT_SEARCH":
            return await self._search_products(intent["parameters"])
        elif intent["type"] == "RISK_QUERY":
            return await self._get_risk_information(intent["parameters"])
        elif intent["type"] == "LOCATION_QUERY":
            return await self._get_location_information(intent["parameters"])
        elif intent["type"] == "ALERT_QUERY":
            return await self._get_alert_information(intent["parameters"])
        else:
            return {
                "response": "I can help you with product searches, risk assessments, location tracking, and alert monitoring.",
                "available_queries": [
                    "Show products from [manufacturer]",
                    "What are the high-risk shipments?",
                    "Where is product [ID]?",
                    "Show alerts for today"
                ]
            }
    
    # Private helper methods for AI processing
    async def _validate_product_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """AI-powered product data validation"""
        errors = []
        
        # Check required fields
        required_fields = ["name", "category", "origin", "manufacturer", "production_date"]
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f"Missing required field: {field}")
        
        # Validate date format
        try:
            datetime.fromisoformat(data.get("production_date", ""))
        except:
            errors.append("Invalid production_date format")
        
        # AI regulatory code validation
        if "regulatory_codes" in data:
            for code in data["regulatory_codes"]:
                if not await self._validate_regulatory_code(code):
                    errors.append(f"Invalid regulatory code: {code}")
        
        return {"valid": len(errors) == 0, "errors": errors}
    
    async def _check_regulatory_compliance(self, product: ProductData) -> Dict[str, Any]:
        """Check regulatory compliance using AI"""
        compliance_results = []
        
        for code in product.regulatory_codes:
            # Simulate regulatory check
            is_valid = await self._verify_regulatory_api(code, product.category)
            compliance_results.append({
                "code": code,
                "valid": is_valid,
                "source": "AI_Regulatory_Verification"
            })
        
        return {
            "overall_compliant": all(result["valid"] for result in compliance_results),
            "details": compliance_results
        }
    
    async def _analyze_current_risks(self, product_id: str, location: LocationData) -> RiskPrediction:
        """AI-powered real-time risk analysis"""
        risk_factors = []
        confidence = 0.9
        
        # Temperature risk analysis
        if location.temperature:
            if location.temperature < 0 or location.temperature > 40:
                risk_factors.append("temperature_extreme")
                confidence -= 0.2
        
        # Humidity risk analysis
        if location.humidity:
            if location.humidity < 30 or location.humidity > 80:
                risk_factors.append("humidity_extreme")
                confidence -= 0.15
        
        # Shock/vibration analysis
        if location.shock_level and location.shock_level > 5:
            risk_factors.append("excessive_shock")
            confidence -= 0.25
        
        # Determine risk level
        if len(risk_factors) >= 2 or confidence < 0.6:
            level = RiskLevel.HIGH
            recommendation = "Immediate attention required - conditions may affect product quality"
        elif len(risk_factors) >= 1 or confidence < 0.8:
            level = RiskLevel.MEDIUM
            recommendation = "Monitor conditions closely"
        else:
            level = RiskLevel.LOW
            recommendation = "Conditions are within acceptable range"
        
        return RiskPrediction(
            level=level,
            factors=risk_factors,
            confidence=confidence,
            recommendation=recommendation,
            predicted_time=datetime.now(timezone.utc)
        )
    
    async def _get_weather_data(self, origin: LocationData, destination: Dict[str, float]) -> Dict[str, Any]:
        """Fetch real-time weather data (simulated)"""
        # In real implementation, this would call a weather API
        return {
            "temperature": 25 + (hash(str(origin.latitude + origin.longitude)) % 20) - 10,
            "humidity": 60 + (hash(str(origin.latitude)) % 30),
            "severe_weather": hash(str(datetime.now().date())) % 20 == 0,
            "temperature_extreme": False
        }
    
    async def _get_traffic_data(self, origin: LocationData, destination: Dict[str, float]) -> Dict[str, Any]:
        """Fetch real-time traffic data (simulated)"""
        # In real implementation, this would call a traffic API
        return {
            "congestion_level": min(1.0, (hash(str(origin.latitude)) % 100) / 100.0),
            "average_delay": (hash(str(destination)) % 60),
            "incidents": hash(str(datetime.now().hour)) % 5
        }
    
    async def _interpret_query_intent(self, query: str) -> Dict[str, Any]:
        """AI-powered natural language query interpretation"""
        query_lower = query.lower()
        
        # Simple intent detection (in real implementation, this would use NLP)
        if "product" in query_lower or "item" in query_lower:
            return {
                "type": "PRODUCT_SEARCH",
                "parameters": {"query": query}
            }
        elif "risk" in query_lower or "danger" in query_lower:
            return {
                "type": "RISK_QUERY",
                "parameters": {"query": query}
            }
        elif "where" in query_lower or "location" in query_lower:
            return {
                "type": "LOCATION_QUERY",
                "parameters": {"query": query}
            }
        elif "alert" in query_lower or "warning" in query_lower:
            return {
                "type": "ALERT_QUERY",
                "parameters": {"query": query}
            }
        
        return {"type": "GENERAL_QUERY", "parameters": {"query": query}}
    
    # Utility methods
    def _generate_product_id(self, data: Dict[str, Any]) -> str:
        """Generate unique product ID"""
        content = f"{data['name']}{data['batch_number']}{data['production_date']}"
        return hashlib.sha256(content.encode()).hexdigest()[:16]
    
    def _generate_alert_id(self) -> str:
        """Generate unique alert ID"""
        import uuid
        return str(uuid.uuid4())[:8]
    
    async def _get_latest_location(self, product_id: str) -> Optional[LocationData]:
        """Get most recent location for product"""
        locations = self.locations.get(product_id, [])
        return locations[-1] if locations else None
    
    async def _calculate_traceability_score(self, product_id: str) -> float:
        """Calculate overall traceability score"""
        if product_id not in self.products:
            return 0.0
        
        score = 0.0
        max_score = 100.0
        
        # Product registration completeness
        product = self.products[product_id]
        if product.regulatory_codes:
            score += 20.0
        if product.specifications:
            score += 15.0
        if product.sensors_config:
            score += 15.0
        
        # Location tracking completeness
        location_count = len(self.locations.get(product_id, []))
        if location_count > 0:
            score += min(30.0, location_count * 2.0)  # Max 30 points for tracking
        
        # Alert response
        product_alerts = [alert for alert in self.alerts if alert.id.startswith(product_id)]
        if not product_alerts:
            score += 20.0  # Bonus for no alerts
        else:
            resolved_alerts = sum(1 for alert in product_alerts if alert.resolution)
            score += (resolved_alerts / len(product_alerts)) * 20.0
        
        return min(score, max_score)
    
    # Placeholder methods for API integrations
    async def _load_risk_models(self):
        """Load AI risk prediction models"""
        pass
    
    async def _setup_regulatory_apis(self):
        """Setup regulatory database connections"""
        pass
    
    async def _verify_regulatory_api(self, code: str, category: str) -> bool:
        """Verify regulatory code against API"""
        return True  # Simplified for demo
    
    async def _validate_regulatory_code(self, code: str) -> bool:
        """Validate regulatory code format"""
        return bool(re.match(r'^[A-Z0-9-]+$', code))
    
    async def _analyze_document_fraud_risk(self, document: Dict[str, Any]) -> float:
        """Analyze document for fraud risk"""
        # Simple hash-based analysis for demo
        return (hash(str(document)) % 100) / 100.0
    
    async def _verify_regulatory_database(self, document: Dict[str, Any]) -> Dict[str, Any]:
        """Verify document against regulatory database"""
        return {"valid": True, "source": "Simulated_Regulatory_DB"}
    
    async def _assess_initial_risks(self, product_id: str):
        """Perform initial risk assessment for new product"""
        pass
    
    async def _get_current_risk_assessment(self, product_id: str) -> Optional[RiskPrediction]:
        """Get current risk assessment for product"""
        if product_id not in self.products:
            return None
        
        # Return default low risk for demo
        return RiskPrediction(
            level=RiskLevel.LOW,
            factors=[],
            confidence=0.9,
            recommendation="Standard monitoring active",
            predicted_time=datetime.now(timezone.utc)
        )
    
    async def _analyze_historical_patterns(self, product_id: str) -> List[str]:
        """Analyze historical risk patterns"""
        return []  # Simplified for demo
    
    async def _log_event(self, event_type: str, data: Dict[str, Any]):
        """Log system events"""
        print(f"ChainAware Event: {event_type} - {json.dumps(data)}")
    
    async def _search_products(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Search products based on criteria"""
        return {"products": list(self.products.values()), "count": len(self.products)}
    
    async def _get_risk_information(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Get risk-related information"""
        return {"risks": [alert for alert in self.alerts if alert.level in [RiskLevel.HIGH, RiskLevel.CRITICAL]]}
    
    async def _get_location_information(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Get location information"""
        return {"locations": self.locations}
    
    async def _get_alert_information(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Get alert information"""
        return {"alerts": self.alerts, "count": len(self.alerts)}