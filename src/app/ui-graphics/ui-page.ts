import { Shape } from "paper";

export class UiPage {

    constructor(paperProject: any, width: number, height: number) {
        var shape = new Shape.Rectangle({
            point: [10, 10],
            size: [width, height],
            fillColor: 'white',
            isPage: true
          });
    }

}