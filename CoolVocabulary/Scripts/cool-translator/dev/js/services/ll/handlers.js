export default class LLHandlers{
	play_sound(soundEl) {
		$(soundEl).find('audio')[0].play();
    	return false;
	};
}