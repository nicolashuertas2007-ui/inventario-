// Paso 3: los datos
const productos = [
  { nombre: "Arroz",  categoria: "Granos",   precio: 4500,  cantidad: 25, minimo: 10 },
  { nombre: "Aceite", categoria: "Despensa", precio: 12000, cantidad: 3,  minimo: 5 },
  { nombre: "Azúcar", categoria: "Despensa", precio: 3800,  cantidad: 0,  minimo: 8 },
  { nombre: "Café",   categoria: "Bebidas",  precio: 18500, cantidad: 8,  minimo: 4 },
  { nombre: "Leche",  categoria: "Lácteos",  precio: 4200,  cantidad: 2,  minimo: 6 },
  { nombre: "Panela", categoria: "Despensa", precio: 3000,  cantidad: 15, minimo: 10 },
  { nombre: "Queso",  categoria: "Lácteos",  precio: 9800,  cantidad: 4,  minimo: 5 },
  { nombre: "Jugo",   categoria: "Bebidas",  precio: 5200,  cantidad: 4,  minimo: 3 }
];

// Elementos de la página
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const resumen = document.getElementById("resumen");

// Paso 9: todo dentro de una función para poder redibujar
function mostrarInventario() {
  // 1. Limpiar lo que había antes
  cuerpoTabla.innerHTML = "";
  resumen.innerHTML = "";

  // 2. Acumuladores (dentro de la función: empiezan en 0 en cada redibujado)
  let totalAgotados = 0;
  let totalBajoStock = 0;
  let unidadesAPedir = 0;
  let valorInventario = 0;
  let mayorSubtotal = -1;   // Empieza en -1 para que cualquier subtotal sea mayor
  let filaMayor = null;     // La fila del producto ganador
  let nombreMayor = "";     // Su nombre

  // 3. Recorrer los productos
  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    const subtotal = producto.precio * producto.cantidad;

    const fila = document.createElement("tr");

    // Nombre
    const tdNombre = document.createElement("td");
    tdNombre.textContent = producto.nombre;

    // Categoría: un <span> dentro de la celda
    const tdCategoria = document.createElement("td");
    const etiqueta = document.createElement("span");
    etiqueta.textContent = producto.categoria;
    etiqueta.classList.add("etiqueta");

    if (producto.categoria === "Granos") {
      etiqueta.style.backgroundColor = "#8d6e63";
    } else if (producto.categoria === "Despensa") {
      etiqueta.style.backgroundColor = "#6f42c1";
    } else if (producto.categoria === "Bebidas") {
      etiqueta.style.backgroundColor = "#0d6efd";
    } else if (producto.categoria === "Lácteos") {
      etiqueta.style.backgroundColor = "#20c997";
    } else {
      etiqueta.style.backgroundColor = "gray";
    }
    tdCategoria.appendChild(etiqueta);

    // Precio con puntos de miles
    const tdPrecio = document.createElement("td");
    tdPrecio.textContent = "$" + producto.precio.toLocaleString("es-CO");
    if (producto.precio > 10000) {
      tdPrecio.style.fontWeight = "bold";
    }

    // Cantidad con botones − y + (paso 10)
    const tdCantidad = document.createElement("td");

    // Botón de menos
    const btnMenos = document.createElement("button");
    btnMenos.textContent = "−";
    btnMenos.classList.add("btn", "btn-menos");
    if (producto.cantidad === 0) {
      btnMenos.disabled = true; // No se puede bajar de 0
    }
    btnMenos.addEventListener("click", function () {
      if (productos[i].cantidad > 0) {
        productos[i].cantidad--; // Cambia el dato
        mostrarInventario();     // Redibuja todo
      }
    });

    // Número de la cantidad
    const numero = document.createElement("span");
    numero.textContent = producto.cantidad;
    numero.classList.add("numero");

    // Botón de más
    const btnMas = document.createElement("button");
    btnMas.textContent = "+";
    btnMas.classList.add("btn", "btn-mas");
    btnMas.addEventListener("click", function () {
      productos[i].cantidad++;
      mostrarInventario();
    });

    // Resultado en la celda: [−] 5 [+]
    tdCantidad.appendChild(btnMenos);
    tdCantidad.appendChild(numero);
    tdCantidad.appendChild(btnMas);

    // Mínimo
    const tdMinimo = document.createElement("td");
    tdMinimo.textContent = producto.minimo;

    // Subtotal
    const tdSubtotal = document.createElement("td");
    tdSubtotal.textContent = "$" + subtotal.toLocaleString("es-CO");

    // Estado (paso 6) con acumuladores (paso 7)
    const tdEstado = document.createElement("td");
    if (producto.cantidad === 0) {
      fila.classList.add("agotado");
      const faltan = producto.minimo;
      tdEstado.textContent = "AGOTADO - pedir " + faltan;
      tdEstado.style.color = "#dc3545";
      tdEstado.style.fontWeight = "bold";
      totalAgotados++;
      unidadesAPedir += faltan;
    } else if (producto.cantidad < producto.minimo) {
      fila.classList.add("bajo-stock");
      const faltan = producto.minimo - producto.cantidad;
      tdEstado.textContent = "Bajo stock - pedir " + faltan;
      totalBajoStock++;
      unidadesAPedir += faltan;
    } else {
      fila.classList.add("disponible");
      tdEstado.textContent = "OK";
    }

    valorInventario += subtotal; // Fuera del if: se suma para TODOS

    // Paso 8: buscar el mayor subtotal
    if (subtotal > mayorSubtotal) {
      mayorSubtotal = subtotal;
      filaMayor = fila;
      nombreMayor = producto.nombre;
    }

    // Armar la fila en el mismo orden de los encabezados
    fila.appendChild(tdNombre);
    fila.appendChild(tdCategoria);
    fila.appendChild(tdPrecio);
    fila.appendChild(tdCantidad);
    fila.appendChild(tdMinimo);
    fila.appendChild(tdSubtotal);
    fila.appendChild(tdEstado);

    cuerpoTabla.appendChild(fila);
  }

  // 4. Destacar la fila de mayor valor y mostrar el resumen (fuera del for)
  filaMayor.classList.add("destacado");

  const pAgotados = document.createElement("p");
  pAgotados.textContent = "Productos agotados: " + totalAgotados;

  const pBajo = document.createElement("p");
  pBajo.textContent = "Productos con bajo stock: " + totalBajoStock;

  const pPedir = document.createElement("p");
  pPedir.textContent = "Unidades a pedir: " + unidadesAPedir;

  const pValor = document.createElement("p");
  pValor.textContent = "Valor total del inventario: $" +
    valorInventario.toLocaleString("es-CO");
  pValor.style.fontWeight = "bold";

  const pMayor = document.createElement("p");
  pMayor.textContent = "Producto con mayor valor: " + nombreMayor +
    " ($" + mayorSubtotal.toLocaleString("es-CO") + ")";

  resumen.appendChild(pAgotados);
  resumen.appendChild(pBajo);
  resumen.appendChild(pPedir);
  resumen.appendChild(pValor);
  resumen.appendChild(pMayor);
}

// 5. Llamar la función para que la tabla aparezca al abrir la página
mostrarInventario();
