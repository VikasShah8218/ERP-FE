import { Howl } from "howler";
import notiWav from "../assets/sounds/noti.wav";
import errorWav from "../assets/sounds/error.wav";
import msgWav from "../assets/sounds/msg.wav";

const notiSound = new Howl({src: [notiWav]});
const errorSound = new Howl({src: [errorWav]});
const msgSound = new Howl({src: [msgWav]});

const playNotiSound = () => notiSound.play();
const playErrorSound = () => errorSound.play();
const playMsgSound = () => msgSound.play();

export { playNotiSound, playErrorSound, playMsgSound };
