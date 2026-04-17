# 🃏 React Blackjack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![LocalStorage](https://img.shields.io/badge/LocalStorage-005A9C?style=for-the-badge&logo=browser&logoColor=white)

Un simulador de **Blackjack**  desarrollado con React. 
---

## Características Principales

* **🎰 Sistema de Apuestas:** Incluye gestión de saldo dinámico con fichas de $5, $25 y $100.
* **💾 Persistencia de Saldo:** Tu saldo se guarda automáticamente en el navegador (`localStorage`), permitiendo retomar la partida en cualquier momento.
* **🔄 Animaciones 3D:** Efecto de rotación física de las cartas y animación de reparto desde el mazo.
* **🏠 Lógica de Crupier Realista:** El crupier juega con una carta oculta y debe pedir carta obligatoriamente hasta alcanzar 17 puntos.
* **🎨 Diseño Premium:** Fondo de tapete de casino profesional generado mediante degradados CSS y assets de alta calidad de *Kenney Assets*.

---

## 🚀 Instalación y Uso

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/rubeengc/BlackJack.git
    ```

2.  **Instalar dependencias:**
    ```bash
    cd blackjack-react
    npm install
    ```

3.  **Iniciar la aplicacion:**
    ```bash
    npm run build
    ```
4.  **Descargar un servidor web:**

     **Consejo:** Usar Simple Web Server es muy fácil y comodo.

6.  **Abrir el navegador:**
   
       **Un pequeño recordatorio técnico:** Como estás usando un servidor estático, cada vez que hagas un cambio en el código de `Blackjack.js` o `Blackjack.css`,     tendrás que ejecutar de nuevo el comando `npm run build` para que los cambios se reflejen en la carpeta que está sirviendo el puerto 8082. ¡Suerte con esas   manos de 21! 🃏🔥

---

## 🛠️ Tecnologías Utilizadas

* **React.js:** Manejo de estados complejos y ciclo de vida.
* **CSS:** Uso de `Perspective`, `Preserve-3d` y `Backface-visibility` para efectos 3D.
* **Web Storage:** Para el almacenamiento local del saldo del jugador.
* **Kenney Assets:** Colección de imágenes de cartas para una estética limpia.

---

## 📋 Reglas del Juego implementadas

1.  **Objetivo:** Superar la puntuación del crupier sin pasarse de 21.
2.  **Pagos:**
    * Victoria estándar: 1 a 1 ($200 si apuestas $100).
    * Blackjack natural: 3 a 2 ($250 si apuestas $100).
    * Empate (Push): Se devuelve la apuesta íntegra.
---

## 📸 Estructura de Archivos

```text
src/
├── components/
│   ├── Blackjack.js    # Lógica principal del juego
│   └── Blackjack.css   # Estilos, animaciones y efectos 3D
├── img/                # Assets de las cartas
└── App.js              # Punto de entrada
