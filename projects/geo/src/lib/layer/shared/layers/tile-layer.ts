import TileLayerOl from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';

import { TileWatcher } from '../../utils';
import { IgoMap } from '../../../map';

import { OSMDataSource } from '../../../datasource/shared/datasources/osm-datasource';
import { WMTSDataSource } from '../../../datasource/shared/datasources/wmts-datasource';
import { XYZDataSource } from '../../../datasource/shared/datasources/xyz-datasource';

import { Layer } from './layer';
import { TileLayerOptions } from './tile-layer.interface';

export class TileLayer extends Layer {
  public dataSource: OSMDataSource | WMTSDataSource | XYZDataSource;
  public options: TileLayerOptions;
  public ol: TileLayerOl;

  private watcher: TileWatcher;

  constructor(options: TileLayerOptions) {
    super(options);

    this.watcher = new TileWatcher(this);
    this.status$ = this.watcher.status$;
  }

  protected createOlLayer(): TileLayerOl {
    const olOptions = Object.assign({}, this.options, {
      source: this.options.source.ol as TileSource
    });

    return new TileLayerOl(olOptions);
  }

  public add(map: IgoMap) {
    this.watcher.subscribe(() => {});
    super.add(map);
  }

  public remove() {
    this.watcher.unsubscribe();
    super.remove();
  }
}