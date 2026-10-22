import { Pipe, PipeTransform } from '@angular/core';

const formato = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

@Pipe({
  name: 'pesos',
  standalone: false
})
export class PesosPipe implements PipeTransform {

  transform( valor: number | string | null | undefined ): string {

    const numero = Number(valor ?? 0);

    if ( Number.isNaN(numero) ) {
      return '';
    }

    return `${ numero < 0 ? '-' : '' }$${ formato.format(Math.abs(numero)) }`;

  }

}
