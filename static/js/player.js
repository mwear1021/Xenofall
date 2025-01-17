export default class Player {
    constructor(x, y, bulletController, width = 50, height = 50) {
        this.x = x;
        this.y = y;
        this.bulletController = bulletController;
        this.width = width;
        this.height = height;
        this.speed = 4;
        this.isAlive = true;
        this.clones = [];

        // Load the player sprite image
        this.image = new Image();
        this.image.src = "./static/images/starship-removebg-preview.png";

        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
    }

    // Updated draw method to ensure clones move and shoot with the player
    draw(ctx) {
        this.move();

        // Draw the player
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        this.shoot();

        // Draw and update clones
        for (const clone of this.clones) {
            clone.x = this.x + clone.offsetX;
            clone.y = this.y + clone.offsetY;
            clone.draw(ctx);

            // Make clones shoot along with the player
            if (this.shootPressed) {
                const bulletX = clone.x + clone.width / 2;
                const bulletY = clone.y;
                this.bulletController.shoot(bulletX, bulletY, 5, 1, 7);
            }
        }
    }

    isColliding(enemy) {
        return !(
            this.x + this.width < enemy.x ||
            this.x > enemy.x + enemy.width ||
            this.y + this.height < enemy.y ||
            this.y > enemy.y + enemy.height
        );
    }

    die() {
        this.isAlive = false;
        console.log('Player has died!');
    }

    shoot() {
        if (this.shootPressed) {
            const bulletX = this.x + this.width / 2;
            const bulletY = this.y;
            this.bulletController.shoot(bulletX, bulletY, 5, 1, 7);
        }
    }

    move() {
        if (this.leftPressed) {
            this.x -= this.speed * 1.25;
        }
        if (this.rightPressed) {
            this.x += this.speed * 1.25;
        }

        // Prevent the player and clones from going out of bounds
        this.x = Math.max(0, Math.min(this.x, 550 - this.width));
    }

    keydown = (e) => {
        if (e.code === "ArrowLeft") {
            this.leftPressed = true;
        }
        if (e.code === "ArrowRight") {
            this.rightPressed = true;
        }
        if (e.code === "Space") {
            this.shootPressed = true;
        }
        e.preventDefault();
        e.stopPropagation();
    };

    keyup = (e) => {
        if (e.code === "ArrowLeft") {
            this.leftPressed = false;
        }
        if (e.code === "ArrowRight") {
            this.rightPressed = false;
        }
        if (e.code === "Space") {
            this.shootPressed = false;
        }
        e.preventDefault();
        e.stopPropagation();
    };
}
