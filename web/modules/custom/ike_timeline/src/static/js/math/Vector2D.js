define(["jquery"], function($) {
  var Vector2D;
  return Vector2D = (function() {
    function Vector2D(valueX, valueY) {
      if (valueX == null) {
        valueX = 0;
      }
      if (valueY == null) {
        valueY = 0;
      }
      this._x = valueX;
      this._y = valueY;
    }

    Vector2D.prototype.setVecX = function(_x) {
      this._x = _x;
    };

    Vector2D.prototype.getVecX = function() {
      return this._x;
    };

    Vector2D.prototype.setVecY = function(_y) {
      this._y = _y;
    };

    Vector2D.prototype.getVecY = function() {
      return this._y;
    };

    Vector2D.prototype.setVector = function(valueX, valueY) {
      this._x = valueX;
      this._y = valueY;
      return null;
    };

    Vector2D.prototype.reset = function() {
      this._x = 0;
      this._y = 0;
      return null;
    };

    Vector2D.prototype.getMagnitude = function() {
      var lengthX, lengthY, mag;
      lengthX = this._x;
      lengthY = this._y;
      mag = Math.sqrt(lengthX * lengthX + lengthY * lengthY);
      return mag;
    };

    Vector2D.prototype.getAngle = function() {
      var ang, lengthX, lengthY;
      lengthX = this._x;
      lengthY = this._y;
      ang = Math.atan2(lengthY, lengthX);
      return ang;
    };

    Vector2D.prototype.duplicate = function() {
      var dup;
      dup = new Vector2D(this._x, this._y);
      return dup;
    };

    Vector2D.prototype.getVectorDirection = function() {
      var vectorDirection, x, y;
      x = this._x / this.getMagnitude();
      y = this._y / this.getMagnitude();
      vectorDirection = new Vector2D(x, y);
      return vectorDirection;
    };

    Vector2D.prototype.minusVector = function(vector2) {
      this._x -= vector2.getVecX();
      this._y -= vector2.getVecY();
      return null;
    };

    Vector2D.prototype.addVector = function(vector2) {
      this._x += vector2.getVecX();
      this._y += vector2.getVecY();
      return null;
    };

    Vector2D.prototype.multiply = function(scalar) {
      this._x *= scalar;
      this._y *= scalar;
      return null;
    };

    Vector2D.prototype.validate = function() {
      if (isNaN(this._x)) {
        this._x = 0;
      }
      if (isNaN(this._y)) {
        return this._y = 0;
      }
    };

    return Vector2D;

  })();
});
