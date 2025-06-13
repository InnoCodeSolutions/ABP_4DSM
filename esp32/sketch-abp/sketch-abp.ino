#include <WiFi.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <HTTPClient.h>
#include <TinyGPSPlus.h>  

// Wi-Fi
const char* ssid = "NOME DO SEU WIFI";
const char* password = "SENHA DO SEU WIFI";

// Endpoint do servidor (IPV4 da Máquina)
const char* serverEndpoint = "https://innocodesutionsbackend.up.railway.app/gps";

// LCD: endereço I2C, 16 colunas, 2 linhas
LiquidCrystal_I2C lcd(0x27, 16, 2); // Tente 0x3F se 0x27 não funcionar

// GPS
#define RXPin 16  // Pino RX do ESP32 conectado ao TX do GPS
#define TXPin 17  // Pino TX do ESP32 conectado ao RX do GPS
#define GPSBaud 9600 // Baud rate do GPS

// Instâncias
TinyGPSPlus gps;  // Nome correto da classe
HardwareSerial GPSSerial(1);  // ESP32 tem múltiplas portas seriais (use UART1)

// Variáveis para armazenar dados do GPS
float latitude = 0.0;
float longitude = 0.0;
bool gpsDataValid = false;

// Controle de tempo para envio periódico
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000;  // 05 segundos

void setup() {
  Serial.begin(9600);
  
  // Inicializa a porta serial do GPS
  GPSSerial.begin(GPSBaud, SERIAL_8N1, RXPin, TXPin);
  Serial.println("Módulo GPS inicializado com baud rate 9600");

  // Inicia LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Iniciando GPS...");
  lcd.setCursor(0, 1);
  lcd.print("Aguarde");
  delay(2000);
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Conectando WiFi");

  // Limpa redes anteriores
  WiFi.disconnect(true, true);  // Força desligar e apaga redes salvas
  delay(1000);

  // Faz scan de redes disponíveis
  int n = WiFi.scanNetworks();
  Serial.println("Redes WiFi encontradas:");
  if (n == 0) {
    Serial.println("Nenhuma rede encontrada.");
  } else {
    for (int i = 0; i < n; ++i) {
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.println(" dBm)");
    }
  }

  // Conectar ao Wi-Fi
  WiFi.begin(ssid, password);

  unsigned long startAttemptTime = millis();
  const unsigned long wifiTimeout = 10000; // 10 segundos
  int dotPos = 0;

  // Animação enquanto tenta conectar
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < wifiTimeout) {
    Serial.print(".");
    lcd.setCursor(dotPos % 16, 1);
    lcd.print(".");
    dotPos++;
    delay(500);
  }

  lcd.clear();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Wi-Fi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());

    lcd.setCursor(0, 0);
    lcd.print("WiFi Conectado");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
  } else {
    Serial.println("\n❌ Falha ao conectar.");
    int status = WiFi.status();
    Serial.print("Status: ");
    Serial.println(status);

    lcd.setCursor(0, 0);
    lcd.print("WiFi Falhou :(");

    switch (status) {
      case WL_NO_SSID_AVAIL:
        Serial.println("❗ SSID não encontrado. Verifique o nome ou alcance.");
        lcd.setCursor(0, 1);
        lcd.print("SSID ausente");
        break;

      case WL_CONNECT_FAILED:
        Serial.println("❗ Falha de autenticação. Senha incorreta?");
        lcd.setCursor(0, 1);
        lcd.print("Senha incorreta");
        break;

      case WL_DISCONNECTED:
        Serial.println("❗ Desconectado. Sem conexão.");
        lcd.setCursor(0, 1);
        lcd.print("Sem conexao");
        break;

      default:
        Serial.println("❓ Erro desconhecido.");
        lcd.setCursor(0, 1);
        lcd.print("Erro desconhecido");
        break;
    }
  }
}

void loop() {
  // Verifica e processa dados do GPS
  readGPS();
  
  // Se estamos conectados, verificamos se é hora de enviar dados
  if (WiFi.status() == WL_CONNECTED) {
    unsigned long currentTime = millis();
    
    // Envia dados a cada intervalo definido OU quando temos dados válidos pela primeira vez
    if ((gpsDataValid && (currentTime - lastSendTime >= sendInterval)) || 
        (gpsDataValid && lastSendTime == 0)) {
      sendGPSData();
      lastSendTime = currentTime;
    }
  } else {
    // Se WiFi caiu, tentamos reconectar
    Serial.println("Reconectando ao WiFi...");
    WiFi.begin(ssid, password);
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Reconectando");
    lcd.setCursor(0, 1);
    lcd.print("WiFi...");
    
    delay(5000); // Aguarda um tempo para tentar reconectar
  }
}

void readGPS() {
  // Lê dados do GPS enquanto estiverem disponíveis
  while (GPSSerial.available() > 0) {
    if (gps.encode(GPSSerial.read())) {
      displayGPSInfo();
    }
  }
  
  // Verifica se o módulo GPS está conectado (após 5 segundos sem dados)
  if (millis() > 5000 && gps.charsProcessed() < 10) {
    Serial.println("⚠️ Módulo GPS não detectado. Verifique a conexão.");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("GPS nao");
    lcd.setCursor(0, 1);
    lcd.print("detectado!");
    delay(2000);
  }
}

void displayGPSInfo() {
  if (gps.location.isValid()) {
    latitude = gps.location.lat();
    longitude = gps.location.lng();
    gpsDataValid = true;
    
    Serial.print("Localização: ");
    Serial.print(latitude, 6);
    Serial.print(", ");
    Serial.println(longitude, 6);
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Lat: ");
    lcd.print(latitude, 6);
    lcd.setCursor(0, 1);
    lcd.print("Lng: ");
    lcd.print(longitude, 6);
  } else {
    Serial.println("Aguardando dados de localização válidos...");
  }
  
  if (gps.date.isValid()) {
    Serial.print("Data: ");
    Serial.print(gps.date.day());
    Serial.print("/");
    Serial.print(gps.date.month());
    Serial.print("/");
    Serial.println(gps.date.year());
  }
  
  if (gps.time.isValid()) {
    Serial.print("Hora: ");
    if (gps.time.hour() < 10) Serial.print("0");
    Serial.print(gps.time.hour());
    Serial.print(":");
    if (gps.time.minute() < 10) Serial.print("0");
    Serial.print(gps.time.minute());
    Serial.print(":");
    if (gps.time.second() < 10) Serial.print("0");
    Serial.println(gps.time.second());
  }
  
  Serial.print("Satélites: ");
  Serial.println(gps.satellites.value());
}

void sendGPSData() {
  if (!gpsDataValid) {
    Serial.println("Ainda não há dados GPS válidos para enviar");
    return;
  }
  
  HTTPClient http;
  http.begin(serverEndpoint);
  http.addHeader("Content-Type", "application/json");
  
  // Monta o JSON com os dados GPS reais
  String payload = "{";
  payload += "\"device_id\": \"Drifter-XX\",";
  payload += "\"latitude\": " + String(latitude, 6) + ",";
  payload += "\"longitude\": " + String(longitude, 6);
  payload += "}";
  
  Serial.println("Enviando dados GPS para o servidor:");
  Serial.println(payload);
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    Serial.print("✅ Código HTTP: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println("📨 Resposta:");
    Serial.println(response);
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("POST OK");
    lcd.setCursor(0, 1);
    lcd.print("GPS enviado");
    delay(2000);
  } else {
    Serial.print("❌ Erro POST: ");
    Serial.println(httpResponseCode);
    
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Erro HTTP:");
    lcd.setCursor(0, 1);
    lcd.print(httpResponseCode);
    delay(2000);
  }
  
  http.end();
}