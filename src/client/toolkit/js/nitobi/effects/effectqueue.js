/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.effects');

/**
 * @private
 * @ignore
 */
nitobi.effects.EffectQueue = function() 
{
	nitobi.effects.EffectQueue.baseConstructor.call(this);
	nitobi.collections.IEnumerable.call(this);
	this.intervalId = 0;
}

nitobi.lang.extend(nitobi.effects.EffectQueue,nitobi.Object);
nitobi.lang.implement(nitobi.effects.EffectQueue,nitobi.collections.IEnumerable);
/**
 * @private
 * @ignore
 */
nitobi.effects.EffectQueue.prototype.add = function(effect)
{
	nitobi.collections.IEnumerable.prototype.add.call(this,effect);
	if (!this.intervalId)
	{
		this.intervalId = window.setInterval(nitobi.lang.close(this,this.step),15);
	}
};
/**
 * @private
 * @ignore
 */
nitobi.effects.EffectQueue.prototype.step = function()
{
	var now = new Date().getTime();
	this.each(function(e) { e.step(now) });
};
/**
 * @private
 * @ignore
 */
nitobi.effects.EffectQueue.globalQueue = new nitobi.effects.EffectQueue();