---
title: Kipper en la PrintrBoard Rev F
date: 2019-08-17 18:22:00 -05:00
layout: project
---

Existe un firmware para [Printrboard ](https://reprap.org/wiki/Printrboard)que, segun entiendo, mejora por mucho la calidad y velocidad de impresión de todos los robots cartesianos que la han usado.

Usualmente el Printrboard Rev F6, que es el que posee la Printrbot, corre un firmware llamado Marlin. Este recibe gCode que los traduce en movimientos de cada eje donde hay un motor, X, Y, Z, y Cada mm que debe salir por el extrusor.

En el caso de Marlin, es la vieja confiable, que funciona en múltiples controladores de CNC.
Klipper, es un software un poco mas reciente que corre en 2 procesos.

En una minicomputadora externa, en este caso la conocida Raspberry PI, con mucha más capacidad de procesamiento que la Printrboard, conectado por USB Klipper controla el firmware que sustituye a Marlin, poniendo la carga del procesamiento de gCode en el Raspberry, convirtiendo el Printrbot en una mera interfaz mucho más veloz y precisa al no tener la carga de interpretar y procesar el gCode, sino meramente recibir las órdenes de movimiento directo del Raspberry, todo esto usando como control general de la impresión el software libre Octoprint.

En pocas palabras, Klipper hace mas rápida y precisa la impresión, de acuerdo con muchos que lo estan usando. Por lo que creo que vale la pena probarlo.

El problema que encontré es que yo soy usualmente el quien busca tutorial;es y no quien los escribe, y en este caso, escribiré como lo hice, porque si lo tengo que volver a buscar y compilar la información de nuevo, me voy a volver loco.

En primera instancia encontré las instrucciones obviamente en el [sitio del proyecto](https://www.klipper3d.org/Installation.html)

* Lo primero es bajarse [OctoPi](https://github.com/guysoft/OctoPi), que es una version del Linux (Debian) para Raspberry Pi llamada Raspbian, que viene preinstalada con [Octoprint](https://octoprint.org/), proyecto de codigo abierto que fue creado por la brillante mente de [Gina Häußge](https://octoprint.org/).

-Lo siguiente es conectarse al Raspberry por SSH, y pegarle estos comandos:
```
    git clone https://github.com/KevinOConnor/klipper
    ./klipper/scripts/install-octopi.sh
```

Este copia todo el código de Klipper en la Raspberry e instala todas esas cosas que necesita Klipper.

- Compilar el código para su controlador, en mi caso la Printrboard:

```
cd ~/klipper/
make menuconfig
```

![Annotation 2019-08-17 180932.png](/uploads/Annotation%202019-08-17%20180932.png)

En este Menú elegimos la Arquitectura, en mi caso es la que ya esta seleccionada ATMega AVR, y el Microchip seria el at90USB1286, que el que usa la Printrboard.

Luego de esto le damos EXIT y escibimos en la consola SSH

`make`

y el resultado tiene que verse asi:

![Annotation 2019-08-17 185918.png](/uploads/Annotation%202019-08-17%20185918.png)![Annotation 2019-08-17 185918.png](/uploads/Annotation%202019-08-17%20185918.png)

(Si su consola no se ve asi despues del make, debe primero actualizar todo, con un sudo apt-get-update y apt-get upgrade y repetir el `./klipper/scripts/install-octopi.sh` sin que haya ningun error. 

