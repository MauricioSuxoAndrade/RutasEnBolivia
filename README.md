# 🚗 **PROGRAMA PARA ENCONTRAR LA RUTA MÁS CORTA EN EL MAPA DE BOLIVIA** 🌍

Este programa está diseñado para calcular las rutas más cortas entre ciudades de Bolivia, utilizando **algoritmos de rutas más cortas** eficientes. Los algoritmos implementados son **A\*, Dijkstra, Greedy y Búsqueda Bidireccional**.

Este proyecto es parte de la asignatura de **Optimización de Rutas** y está basado en un mapa interactivo de la ciudad de **La Paz**, Bolivia.

## 🔍 **Algoritmos de Rutas Más Cortas Implementados**
1. **A\* (A Estrella)**: Un algoritmo heurístico utilizado para encontrar el camino más corto entre dos puntos, utilizando una función de costo para priorizar la exploración de ciertos caminos.
2. **Dijkstra**: Un algoritmo clásico que encuentra el camino más corto desde un punto de inicio a todos los demás nodos, ideal para grafos con aristas de peso positivo.
3. **Greedy**: Un algoritmo que toma decisiones en cada paso basándose en la elección que parece más beneficiosa localmente.
4. **Búsqueda Bidireccional**: Una variante de Dijkstra que ejecuta dos búsquedas simultáneas desde el origen y el destino para encontrar el camino más rápido de forma más eficiente.

## 🌐 **Descripción**
Este sistema permite al usuario calcular las rutas más cortas entre diferentes puntos de La Paz, Bolivia, considerando las ciudades principales y las coordenadas geográficas de cada una. 

El mapa interactivo permite visualizar el recorrido y utilizar diferentes algoritmos de búsqueda para encontrar la mejor ruta posible.

## 🛠️ **Tecnologías Usadas**
- **React.js** para la interfaz de usuario.
- **MapLibre GL JS** para visualizar el mapa.
- **Vite** como herramienta de bundling.
- **JavaScript** y **ES6** para la lógica de la aplicación.
- **CSS** para el diseño de la interfaz.

## 👥 **Autores**
Este proyecto fue desarrollado por los siguientes integrantes del equipo:

- **Mauricio Alejandro Suxo Andrade** (Jefe)
- **Rudy Luis Mamani Choque**
- **Ronaldo Elvin Yupanqui Salinas**
- **Alvin Akin Mamani Maldonado**
- **Lucas Gustavo Calderón Canaviri**
- **Fabricio Emanuel Martinez Condorena**

## 📦 **Instalación**

Para instalar y ejecutar el proyecto localmente:

1. **Clona el repositorio**:
    ```bash
    git clone https://github.com/MauricioSuxoAndrade/RutasEnBolivia.git
    ```

2. **Accede al directorio del proyecto**:
    ```bash
    cd RutasEnBolivia
    ```

3. **Instala las dependencias**:
    ```bash
    npm install
    ```

4. **Ejecuta la aplicación en modo desarrollo**:
    ```bash
    npm run dev
    ```

5. **Abre el navegador y accede a**: [http://localhost:3000](http://localhost:3000)

## 🌍 **Uso Directo en GitHub**
Si prefieres usar el programa directamente sin instalar nada en tu máquina, puedes acceder al proyecto desde GitHub Pages haciendo clic en el siguiente enlace:

[Acceder a la aplicación en GitHub Pages](https://mauriciosuxoandrade.github.io/RutasEnBolivia/)

1. Ingrese las ciudades de origen y destino en el mapa interactivo.
2. Elija el algoritmo que desea utilizar para calcular la ruta más corta.
3. El programa calculará y visualizará la mejor ruta en el mapa.

