"use strict";
exports.__esModule = true;
exports.EulerIntegrator = void 0;
var vector_1 = require("../Math/vector");
var EulerIntegrator = /** @class */ (function () {
    function EulerIntegrator() {
    }
    EulerIntegrator.integrate = function (transform, motion, totalAcc, elapsedMs) {
        var seconds = elapsedMs / 1000;
        // This code looks a little wild, but it's to avoid creating any new Vector instances
        // integration is done in a tight loop so this is key to avoid GC'ing
        motion.vel.addEqual(totalAcc.scale(seconds, EulerIntegrator._ACC));
        transform.pos
            .add(motion.vel.scale(seconds, EulerIntegrator._VEL), EulerIntegrator._POS)
            .addEqual(totalAcc.scale(0.5 * seconds * seconds, EulerIntegrator._VEL_ACC));
        motion.angularVelocity += motion.torque * (1.0 / motion.inertia) * seconds;
        var rotation = transform.rotation + motion.angularVelocity * seconds;
        transform.scale.add(motion.scaleFactor.scale(seconds, this._SCALE_FACTOR), EulerIntegrator._SCALE);
        var tx = transform.get();
        tx.setTransform(EulerIntegrator._POS, rotation, EulerIntegrator._SCALE);
    };
    // Scratch vectors to avoid allocation
    EulerIntegrator._POS = new vector_1.Vector(0, 0);
    EulerIntegrator._SCALE = new vector_1.Vector(1, 1);
    EulerIntegrator._ACC = new vector_1.Vector(0, 0);
    EulerIntegrator._VEL = new vector_1.Vector(0, 0);
    EulerIntegrator._VEL_ACC = new vector_1.Vector(0, 0);
    EulerIntegrator._SCALE_FACTOR = new vector_1.Vector(0, 0);
    return EulerIntegrator;
}());
exports.EulerIntegrator = EulerIntegrator;
