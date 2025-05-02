# Predicción Precio Vivienda

_Valor estimado de tu futuro hogar._

Este proyecto es una aplicación web para **predecir el precio estimado de vivienda en España** utilizando técnicas de _machine learning_. Consta de un **backend** desarrollado en FastAPI que expone endpoints REST para obtener predicciones de precio, y un **frontend** creado con Astro y React que permite a los usuarios ingresar datos (como la comunidad autónoma) y ver el resultado de la predicción de forma interactiva. El modelo de predicción es una regresión lineal entrenada con _Scikit-Learn_ utilizando datos históricos del mercado inmobiliario (por ejemplo, precios medios por comunidad autónoma provenientes del archivo CSV proporcionado). Esto permite ofrecer estimaciones basadas en datos reales de las distintas regiones de España.

&#x20;_Interfaz de la aplicación mostrando la selección de la comunidad autónoma "Cantabria" y el precio estimado devuelto por el sistema (1508.37 €)._ La interfaz presenta un diseño sencillo: un campo desplegable para elegir la comunidad autónoma y un botón **“Predecir Precio”** para obtener la estimación. Tras enviar la consulta, el resultado (el **precio promedio estimado** de la vivienda en dicha región) se muestra resaltado debajo del botón, facilitando al usuario la comprensión del valor obtenido.

blob:https://chatgpt.com/f59fc022-12da-43a9-9e78-99823a3f3a20

## Estructura del proyecto

El repositorio está organizado en directorios para separar el frontend, backend y los artefactos de datos/modelo entrenado:

- **`backend/`** – Contiene el código del servidor FastAPI. Aquí se encuentra `main.py`, que define los endpoints REST (por ejemplo, un endpoint GET/POST `/predecir/{comunidad}` para obtener el precio estimado dada una comunidad autónoma). Al iniciar, el backend carga el modelo de regresión lineal entrenado desde el archivo `modelo_entrenado.pkl` y lee los datos necesarios del CSV (ubicado en `backend/data/df_mineria_datos_vivienda.csv`). El backend utiliza esta información para calcular la predicción solicitada. También incluye un archivo `requirements.txt` con las dependencias de Python necesarias (FastAPI, scikit-learn, pandas, etc.).
- **`frontend/`** – Contiene la aplicación front-end desarrollada con **Astro** (un framework moderno de frontend) y componentes **React**. En particular, el componente React `PredictForm.jsx` (ubicado en `frontend/src/components/`) renderiza el formulario de entrada donde el usuario selecciona una comunidad autónoma y envía la petición de predicción. La página principal de la aplicación está definida en `frontend/src/pages/index.astro`, que integra el formulario React en la página. El frontend se encarga de realizar la petición al backend (por ejemplo, usando `fetch` a los endpoints de FastAPI) y mostrar el **precio estimado** resultante al usuario. También se incluyen archivos de configuración (`astro.config.mjs`, `tsconfig.json`) y de proyecto (`package.json`, etc.), así como recursos estáticos (ej. `frontend/public/styles.css` para estilos, imágenes como favicon, etc.).
- **`backend/modelo_entrenado.pkl`** – Archivo con el **modelo de regresión lineal** entrenado (serializado con Joblib/Pickle). Este modelo fue generado usando _Scikit-Learn_ a partir de los datos históricos de precios de vivienda. El backend lo carga en memoria al iniciar para realizar predicciones instantáneamente cuando llegan las solicitudes.

**Nota:** El dataset de entrenamiento (`df_mineria_datos_vivienda.csv`) contiene información de precios de vivienda y factores relacionados por comunidad autónoma en España. El backend utiliza estos datos (por ejemplo, calculando valores medios por región) para ayudar a generar la predicción final mediante el modelo. Dicho dataset reside en `backend/data/` y puede ser reemplazado o actualizado para mejorar las predicciones en el futuro.

## Tecnologías utilizadas

Este proyecto integra múltiples tecnologías modernas, tanto de backend como de frontend, para lograr una aplicación completa de análisis de datos y visualización web:

- **FastAPI:** Framework web de Python para construir APIs REST de alto rendimiento. Proporciona las rutas/endpoint para solicitar las predicciones de precio en el servidor.
- **Scikit-Learn:** Biblioteca de _machine learning_ en Python utilizada para entrenar el modelo de **regresión lineal** con los datos históricos de precios de vivienda. También se utiliza junto con Joblib para cargar el modelo entrenado en producción.
- **Pandas:** Biblioteca de manipulación de datos en Python. En este proyecto se emplea para leer y procesar el archivo CSV de datos (`df_mineria_datos_vivienda.csv`), calculando por ejemplo promedios por comunidad autónoma u organizando los datos de entrada al modelo.
- **Astro:** Framework de frontend orientado a contenido estático y rendimiento. Astro permite integrar componentes de diversos frameworks (en este caso React) y generar una aplicación web optimizada. El proyecto Astro facilita servir el frontend en desarrollo y compilarlo para producción si se desea.
- **React:** Biblioteca de JavaScript para construir interfaces de usuario interactivas. Se utiliza dentro de Astro para crear componentes dinámicos como el formulario de predicción (`PredictForm.jsx`), manejando el estado de la entrada del usuario, la llamada a la API backend y la visualización del resultado sin recargar la página.

## Instrucciones de instalación y ejecución

Sigue estos pasos para clonar el repositorio, instalar las dependencias necesarias y ejecutar tanto el backend (servidor FastAPI) como el frontend (aplicación Astro/React):

1. **Clonar el repositorio:**
   Ejecuta en tu terminal:

   ```bash
   git clone <URL-del-repositorio>.git
   cd <directorio-del-proyecto>
   ```

2. **Backend - Instalación de dependencias:**
   Asegúrate de tener **Python 3.x** instalado. Navega al directorio `backend/` del proyecto (opcionalmente crea y activa un entorno virtual). Luego instala las dependencias de Python con pip:

   ```bash
   pip install -r requirements.txt
   ```

   Esto instalará paquetes como FastAPI, uvicorn (servidor ASGI), scikit-learn, pandas, etc., necesarios para el backend.

3. **Backend - Ejecución del servidor:**
   Una vez instaladas las dependencias, inicia el servidor de desarrollo de FastAPI usando Uvicorn:

   ```bash
   uvicorn backend.main:app --reload
   ```

   Este comando levantará el servidor en la dirección `http://127.0.0.1:8000` (puerto 8000 por defecto). El parámetro `--reload` hace que el servidor se reinicie automáticamente si detecta cambios en el código (útil para desarrollo). Deberías ver en la consola mensajes de FastAPI/Uvicorn indicando que el servidor está corriendo.

4. **Frontend - Instalación de dependencias:**
   Asegúrate de tener **Node.js** (y npm) instalado en tu sistema. Navega al directorio `frontend/` del proyecto:

   ```bash
   cd frontend
   ```

   Instala las dependencias de Node (Astro, React, etc.) listadas en `package.json` con:

   ```bash
   npm install
   ```

   Esto descargará todos los paquetes necesarios para ejecutar el frontend.

5. **Frontend - Ejecución de la aplicación:**
   Después de instalar, inicia el servidor de desarrollo del frontend Astro:

   ```bash
   npm run dev
   ```

   Astro iniciará un servidor local para la interfaz web. Por defecto, estará accesible en `http://localhost:4321`. En la consola verás un mensaje indicando en qué URL se está sirviendo la aplicación. Mantén este proceso corriendo (o abre otra terminal) mientras utilizas la aplicación.

**Importante:** Los pasos 3 y 5 lanzan dos servidores separados (backend y frontend). Para que la aplicación funcione correctamente, **ambos servidores deben estar ejecutándose simultáneamente**. El frontend (Astro/React) se comunicará con el backend (FastAPI) para obtener las predicciones. Si el backend no está corriendo, la interfaz mostrará un error de conexión al intentar predecir.

## Cómo usar la aplicación

Una vez instalados y en funcionamiento el frontend y el backend, puedes utilizar la aplicación web siguiendo estos pasos:

1. **Acceder a la interfaz:** Abre tu navegador web e ingresa a la URL del frontend, por defecto `http://localhost:4321`. Se cargará la página principal de **Predicción Precio Vivienda**, que contiene el formulario de predicción.
2. **Ingresar datos de predicción:** En el formulario, verás un campo desplegable para _“Selecciona una comunidad autónoma”_. Haz clic en el desplegable y elige la comunidad autónoma de España sobre la que deseas estimar el precio de vivienda (por ejemplo: Andalucía, Madrid, Cataluña, etc.). Actualmente, la aplicación utiliza principalmente la comunidad autónoma como dato de entrada para la predicción. _(Nota: En caso de que se requirieran más detalles de la vivienda en el futuro – como parámetros económicos o de construcción – el formulario podría ampliarse, pero en esta versión basta con seleccionar la región deseada.)_
3. **Solicitar la predicción:** Tras seleccionar la comunidad, pulsa el botón **“Predecir Precio”**. El frontend enviará una solicitud al servidor FastAPI con la comunidad seleccionada.
4. **Ver el resultado:** En segundos, la página mostrará el **precio estimado** para la comunidad autónoma elegida. Este valor se presenta generalmente en euros (€) y corresponde al precio promedio estimado de la vivienda en esa región, según el modelo entrenado con datos históricos. El resultado aparecerá destacado debajo del botón de predicción, por ejemplo: _“Precio estimado: 1508.37 €”_. Ahora puedes probar con otras comunidades autónomas para comparar estimaciones.

Si la aplicación está correctamente conectada, cada vez que selecciones una región y presiones el botón, debería actualizarse el valor del precio estimado sin necesidad de recargar la página. En caso de que el backend no responda (por ejemplo, si no está activo), se mostrará un mensaje de error indicando que no se pudo conectar con el servidor. Asegúrate de tener ambos componentes en ejecución como se indicó anteriormente.

## Licencia y Autor

**Licencia:** Este proyecto se distribuye bajo la licencia MIT, lo que significa que puedes utilizar, copiar y modificar libremente el código respetando los términos de dicha licencia. Para más detalles, consulta el archivo `LICENSE` incluido en el repositorio (si está disponible) o el texto de la licencia MIT en internet.

**Autor:** _atobio459@gmail.com_ – Desarrollador del proyecto **Predicción Precio Vivienda**. Si tienes preguntas, sugerencias o comentarios sobre el proyecto, no dudes en contactarme o crear un issue en el repositorio. ¡Gracias por probar esta aplicación!
