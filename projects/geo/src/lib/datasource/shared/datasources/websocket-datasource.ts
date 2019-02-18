import olSourceVector from 'ol/source/Vector';
import * as olformat from 'ol/format';
import {unByKey} from 'ol/Observable';
import {easeOut} from 'ol/easing';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

import { Md5 } from 'ts-md5';

import { uuid } from '@igo2/utils';
import { FeatureDataSource } from './feature-datasource';
import { WebSocketDataSourceOptions } from './websocket-datasource.interface';

export class WebSocketDataSource extends FeatureDataSource {
  public ws: WebSocket;
  public options: WebSocketDataSourceOptions;


  protected createOlSource(): olSourceVector {
     this.createWebSocket();
     this.options.format = this.getSourceFormatFromOptions(this.options);
     let olSource = super.createOlSource();



     return olSource;
  }

  private createWebSocket() {
    this.ws = new WebSocket(this.options.url);
    this.ws.onmessage = this.onMessage.bind(this);

    if(this.options.onclose){
      this.ws.onclose = this.onClose.bind(this);
    }

    if(this.options.onclose){
      this.ws.onerror = this.onError.bind(this);
    }

    if(this.options.onclose){
      this.ws.onopen = this.onOpen.bind(this);
    }

  }

  onMessage(event) {

    let featureAdded = this.options.format.readFeature(event.data);

    switch(this.options.onmessage){
      case 'update':
        // ol don't add if same ID
        this.ol.removeFeature(this.ol.getFeatureById(featureAdded.id));
        this.ol.addFeature(featureAdded);
        break;
      case 'delete':
        this.ol.clear(true);
        this.ol.addFeature(featureAdded);
        break;
      case 'add':
      default:
        this.ol.addFeature(featureAdded);
    }

  }

  onClose(event) {
    // thrown message to user
  }

  onError(event) {
    // thrown message to user
  }

  onOpen(event) {
    // thrown message to user ?
  }


}
