import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'tipo-deporte-table',
  styleUrl: 'tipo-deporte-table.css',
  shadow: true,
})
export class TipoDeporteTable {
  @Prop() apiUrl: string; // Propiedad para la URL de la API

  @State() tiposDeportes: any[] = [];
  @State() tipoDeDeporte = {
    id: '',
    nombre: '',
    descripcion: ''
  };

  componentWillLoad() {
    this.fetchTiposDeportes();
  }

  // Obtener tipos de deportes
  async fetchTiposDeportes() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      this.tiposDeportes = data;
    } catch (error) {
      console.log('Error fetching tipos de deportes', error);
    }
  }

  // Crear un nuevo tipo de deporte
  async createTipoDeDeporte() {
    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.tipoDeDeporte)
      });
      this.fetchTiposDeportes();
      this.resetForm();
    } catch (error) {
      console.log('Error creating tipo de deporte', error);
    }
  }

  // Actualizar un tipo de deporte existente
  async updateTipoDeDeporte(id) {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.tipoDeDeporte)
      });
      this.fetchTiposDeportes();
      this.resetForm();
    } catch (error) {
      console.log('Error updating tipo de deporte', error);
    }
  }

  // Eliminar un tipo de deporte
  async deleteTipoDeDeporte(id) {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
      this.fetchTiposDeportes();
    } catch (error) {
      console.log('Error deleting tipo de deporte', error);
    }
  }

  // Manejar cambios en los campos del formulario
  handleInputChange(event) {
    const { name, value } = event.target;
    this.tipoDeDeporte = { ...this.tipoDeDeporte, [name]: value };
  }

  // Reiniciar el formulario
  resetForm() {
    this.tipoDeDeporte = {
      id: '',
      nombre: '',
      descripcion: ''
    };
  }

  render() {
    return (
      <div>
        <h1>Listado de Tipos de Deportes</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.tipoDeDeporte.id ? this.updateTipoDeDeporte(this.tipoDeDeporte.id) : this.createTipoDeDeporte();
          }}
        >
          <input
            type="text"
            name="nombre"
            value={this.tipoDeDeporte.nombre}
            placeholder="Nombre del Deporte"
            onInput={(event) => this.handleInputChange(event)}
          />
          <input
            type="text"
            name="descripcion"
            value={this.tipoDeDeporte.descripcion}
            placeholder="Descripción del Deporte"
            onInput={(event) => this.handleInputChange(event)}
          />
          <button type="submit">{this.tipoDeDeporte.id ? 'Actualizar' : 'Crear'} Tipo de Deporte</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.tiposDeportes.map((tipoDeDeporte) => (
              <tr key={tipoDeDeporte.id}>
                <td>{tipoDeDeporte.id}</td>
                <td>{tipoDeDeporte.nombre}</td>
                <td>{tipoDeDeporte.descripcion}</td>
                <td>
                  <button onClick={() => (this.tipoDeDeporte = tipoDeDeporte)}>Actualizar</button>
                  <button onClick={() => this.deleteTipoDeDeporte(tipoDeDeporte.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}