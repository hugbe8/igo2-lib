import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CapabilitiesService } from './capabilities.service';

import { Layer,
         OSMLayer, OSMLayerOptions,
         VectorLayer, VectorLayerOptions,
         XYZLayer, XYZLayerOptions,
         WFSLayer,
         WMTSLayer, WMTSLayerOptions,
         WMSLayer, WMSLayerOptions } from './layers';

export type AnyLayerOptions =
  OSMLayerOptions | VectorLayerOptions | XYZLayerOptions |
  WMTSLayerOptions | WMSLayerOptions;


@Injectable()
export class LayerService {

  public editedLayer$ = new BehaviorSubject<Layer>(undefined);

  constructor(private capabilitiesService: CapabilitiesService) { }

  createAsyncLayer(options: AnyLayerOptions): Observable<Layer> {
    let layer;
    switch (options.type) {
      case 'osm':
        layer = this.createOSMLayer(options as OSMLayerOptions);
        break;
      case 'vector':
        layer = this.createVectorLayer(options as VectorLayerOptions);
        break;
      case 'wfs':
        layer = this.createWFSLayer(options as VectorLayerOptions);
        break;
      case 'wms':
        layer = this.createWMSLayer(options as WMSLayerOptions);
        break;
      case 'wmts':
        layer = this.createWMTSLayer(options as WMTSLayerOptions);
        break;
      case 'xyz':
        layer = this.createXYZLayer(options as XYZLayerOptions);
        break;
      default:
        break;
    }

    return layer;
  }

  editLayer(layer: Layer) {
    this.editedLayer$.next(layer);
  }

  private createOSMLayer(options: OSMLayerOptions): Observable<OSMLayer> {
    return new Observable(layer => layer.next(new OSMLayer(options)));
  }

  private createVectorLayer(options: VectorLayerOptions): Observable<VectorLayer> {
    return new Observable(layer => layer.next(new VectorLayer(options)));
  }

  private createWFSLayer(options: VectorLayerOptions): Observable<WFSLayer> {
    return new Observable(layer => layer.next(new WFSLayer(options)));
  }

  private createWMSLayer(options: WMSLayerOptions): Observable<WMSLayer> {
    if (options.optionsFromCapabilities) {
      return this.capabilitiesService
        .getWMSOptions(options)
        .map((options_: WMSLayerOptions) => new WMSLayer(options_));
    }

    return new Observable(layer => layer.next(new WMSLayer(options)));
  }

  private createWMTSLayer(options: WMTSLayerOptions): Observable<WMTSLayer> {
    if (options.optionsFromCapabilities) {
      return this.capabilitiesService
        .getWMTSOptions(options)
        .map((options_: WMTSLayerOptions) => new WMTSLayer(options_));
    }

    return new Observable(layer => layer.next(new WMTSLayer(options)));
  }

  private createXYZLayer(options: XYZLayerOptions): Observable<XYZLayer> {
    return new Observable(layer => layer.next(new XYZLayer(options)));
  }
}
