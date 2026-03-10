# AI Email Triage & Automation System 📧🤖

Sistema inteligente de gestión de reclamos desarrollado en **Google Apps Script** e integrado con **Vertex AI (Gemini)**. El proyecto automatiza la clasificación, respuesta y seguimiento de correos electrónicos, transformando un proceso manual en una operación autónoma 24/7.

## 🚀 Descripción del Proyecto

Este sistema actúa como un "operador inteligente" para la bandeja de entrada. Utiliza análisis semántico para clasificar correos entrantes en categorías críticas (Logística, Calidad, Otros), genera tickets de seguimiento automáticamente y audita el cumplimiento de los tiempos de respuesta (SLA).

### Flujo de Trabajo (Fase 1: Human-in-the-Loop)

1.  **Filtrado Inteligente:** Ingesta de correos no leídos, excluyendo spam y notificaciones de sistema.
2.  **Procesamiento IA:** Análisis semántico mediante Vertex AI para clasificar el contenido y realizar auditoría de tokens.
3.  **Ejecución Condicional:** * **Válido:** Generación de Ticket ID, respuesta automática al remitente y registro en Google Sheets.
    * **Inválido:** Notificación en consola (Logs) e ignorado automático.

## 🛠️ Stack Tecnológico

* **Lenguaje:** Google Apps Script (JavaScript).
* **IA Generativa:** Vertex AI API (Modelo: `gemini-2.5-flash`).
* **Workspace:** Gmail API, Google Sheets API.
* **Automatización:** Time-driven Triggers (GCP Cron Jobs).

## 📈 Roadmap de Implementación

### Fase 1: Modo Manual (Estado: ACTIVO)
* Ejecución bajo demanda para validación de la IA y control de seguridad.
* Supervisión humana total antes del escalado.

### Fase 2: Modo Autónomo (Estado: EN ESPERA)
* **Operatividad 24/7:** Migración de disparadores manuales a Cron Jobs en la nube.
* **Micro-ciclos (10 min):** Lectura, análisis y derivación continua.
* **Macro-ciclos (1 hora):** "El Vigilante" – Auditoría automática de respuestas y cumplimiento de SLA (24h).
* **Rol del Usuario:** Evolución de "Operador" a "Auditor" mediante visualización de reportes.

## 💰 Proyección de Costos y Eficiencia

El sistema está diseñado para ser altamente rentable, con un monitoreo de métricas clave integrado:

| Concepto | Volumen Mensual | Costo Estimado (USD) |
| :--- | :--- | :--- |
| Correos Procesados | 10,000 | - |
| Input (Lectura IA) | 5,000,000 tokens | $1.50 |
| Output (Respuestas) | 50,000 tokens | $0.13 |
| **TOTAL MENSUAL** | **-** | **$1.63 USD** |

> **Nota:** Estimación basada en supuestos de 500 tokens por correo y costos actuales de la API de Vertex AI.

$ npm install -g @google/clasp

## 🛠️ Instalación y Configuración (vía clasp)

Este proyecto está diseñado para ser gestionado localmente utilizando **clasp** (Command Line Apps Script Projects).

### 1. Requisitos Previos

* **Node.js** instalado.
* Habilitar la [Google Apps Script API](https://script.google.com/home/usersettings).
* Una cuenta de **Google Cloud** con un proyecto activo y la API de Vertex AI habilitada.

### 2. Instalación de Herramientas

Instala la herramienta de línea de comandos de Google de forma global:

```bash
npm install -g @google/clasp
```

### 3. Configuración del Proyecto

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/vertexai-email-triage-system.git](https://github.com/tu-usuario/vertexai-email-triage-system.git)
    cd vertexai-email-triage-system
    ```

2.  **Inicia sesión en Google:**
    ```bash
    clasp login
    ```

3.  **Crea o vincula tu script:**
    * Para crear uno nuevo: `clasp create --title "Email Triage System" --type standalone`
    * Para vincular uno existente: `clasp clone "TU_SCRIPT_ID"`

### 4. Despliegue

Una vez configuradas las constantes en el archivo `Config.gs`, sube el código local a la nube de Google:

```bash
clasp push
```

### 5. Configuración Final en Google Cloud

Para que la integración con **Vertex AI** sea exitosa, sigue estos pasos:

1.  Obtén tu **Project ID** desde la [consola de Google Cloud](https://console.cloud.google.com/).
    
2.  Actualiza el valor de la constante `PROJECT_ID` en tu archivo `Config.gs`.
3.  En el editor web de Apps Script, ve a **Configuración del proyecto** y vincula el número de tu proyecto de Google Cloud en la sección "Proyecto de Google Cloud Platform (GCP)".
    

---

## ⚙️ Uso de los Triggers

Para ejecutar la **Fase 2 (Modo Autónomo)** y que el sistema trabaje de forma independiente, debes configurar los siguientes activadores (triggers) en el panel lateral de Apps Script:

| Función | Tipo de Evento | Intervalo |
| :--- | :--- | :--- |
| `runEmailAutomation` | Basado en tiempo | Cada 10-15 minutos |
| `runSlaMonitor` | Basado en tiempo | Cada 1 hora |



---

## 📂 Archivo .gitignore recomendado

Para mantener tu repositorio limpio y profesional al usar **clasp**, crea un archivo llamado `.gitignore` en la raíz de tu proyecto con el siguiente contenido:

```text
# Clasp config
.clasp.json

# Dependencies
node_modules/
package-lock.json

# Logs & Temp
*.log
.DS_Store