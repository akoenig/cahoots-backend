# Cahoots - RESTful API

This repository contains the API of the [cahoots.pw](http://cahoots.pw) project.

You find a rough architecture description in the [wiki](https://github.com/getcahoots/api/wiki).

## Usage

Please note that you need a current release (1.x) of [io.js](https://iojs.org) in order to run the Cahoots RESTful API. You can start the API with:

```sh
npm start
```

### Debug log messages

You can set an environment variable in order to see some debug log messages:

```sh
DEBUG=cahoots:* npm start
```

## Submodule documentations

  * [api/validator](https://github.com/getcahoots/api/blob/master/lib/validator/README.md)
  * [api/tokenstore](https://github.com/getcahoots/api/blob/master/lib/tokenstore/README.md)
  * [api/storage](https://github.com/getcahoots/api/blob/master/lib/storage/README.md)
  * [api/services](https://github.com/getcahoots/api/blob/master/lib/services/README.md)
  * [api/schemes](https://github.com/getcahoots/api/blob/master/lib/schemes/README.md)

## License

The MIT License (MIT)

Copyright (c) 2014-2015 Cahoots, Germany <info@cahoots.pw>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
