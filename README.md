# Convert to GeoJSON Action

This action converts an Excel / CSV file to a GeoJSON.

## Inputs

### `input_dir`

**Required** The directory containing the Excel / CSV files to convert. Default `"./"`.

## Example usage

```yaml
name: Build and Deploy
on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    name: Convert Excel to GeoJSON
    steps:
      - name: checkout
        uses: actions/checkout@v3

      - name: 'Convert Excel to GeoJSON'
        uses: geolonia/excel-to-geojson-action@v0.0.1
        with:
          input_dir: './' # [Required] The directory containing the Excel files to convert.
```

## Note
* Values output as GeoJSON property will be the values specified in the Excel cell format.
* For dates (cell format: date, user-defined), the values are output to GeoJSON property in `m/d/yy` format.

## Development

```
$ git clone git@github.com:geolonia/excel-to-geojson-action.git
$ cd excel-to-geojson-action
$ npm install
```

### Build

```
$ npm run build
```


