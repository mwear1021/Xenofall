export default class Enemy {
    constructor(x, y, health, speed, isBoss = false) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.speed = isBoss ? speed * 0.3 : speed * 0.8;  // Boss enemies move slower
        this.isBoss = isBoss;

        this.width = isBoss ? 75 : 50;  // Boss enemies are larger
        this.height = isBoss ? 75 : 50;

        // Load the appropriate sprite
        this.image = new Image();
        this.image.src = isBoss
            ? "./static/images/boss-alien_-removebg-preview.png"  // Boss sprite
            : "./static/images/alien-removebg-preview.png";  // Regular enemy sprite
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.isBoss ? "red" : "green";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // Draw health on top of the enemy
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText(this.health, this.x + this.width / 3.5, this.y + this.height / 1.5);
    }

    takeDamage(damage) {
        this.health -= damage;
    }
}
