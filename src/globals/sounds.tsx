import { Howl } from "howler";
import notiWav from "../../src/globals/sounds/noti.wav";
import errorWav from "./sounds/error.wav";
import msgWav from "./sounds/msg.wav";

const notiSound = new Howl({src: [notiWav]});
const errorSound = new Howl({src: [errorWav]});
const msgSound = new Howl({src: [msgWav]});

const playNotiSound = () => notiSound.play();
const playErrorSound = () => errorSound.play();
const playMsgSound = () => msgSound.play();

export { playNotiSound, playErrorSound, playMsgSound };
