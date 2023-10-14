import rpio from 'rpio'
const ledConfig = require('./config.json')

export const leds = {}
ledConfig['leds'].forEach((led) => {
  leds[led['color']] = led['pin']
})

export const reset = (colour?: string) => {
  if (colour) {
    rpio.open(leds[colour], rpio.INPUT)
    rpio.write(leds[colour], rpio.HIGH)
  } else {
    ledConfig['leds'].forEach((led) => {
      rpio.open(led.pin, rpio.INPUT)
      rpio.write(led.pin, rpio.HIGH)
    })
  }
}

export const status = (colour?: string) => {
  if (colour) {
    rpio.open(leds[colour], rpio.OUTPUT)
    console.log(`Pin ${leds[colour]} (${colour}) is currently ` + (rpio.read(leds[colour]) ? 'high' : 'low'))
  } else {
    ledConfig['leds'].forEach((led) => {
      rpio.open(led.pin, rpio.OUTPUT)
      console.log(`Pin ${led.pin} (${led.color}) is currently ` + (rpio.read(led.pin) ? 'high' : 'low'))
    })
  }
}

export const blink = (colour: string, duration: number) => {
  for (var i = 0; i < duration - 1; i++) {
    /* On for 1 second */
    rpio.write(leds[colour], rpio.HIGH)
    rpio.sleep(1)

    /* Off for half a second (500ms) */
    rpio.write(leds[colour], rpio.LOW)
    rpio.msleep(500)
  }
  reset(colour)
}
