import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'escape'
})
export class EscapePipe implements PipeTransform {

  transform(url: string): string {
    return url.replace(/[-\/\\^$*+?.()|\[\]{}\s]+/g, "");
  }

}
