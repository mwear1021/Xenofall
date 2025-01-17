export default class PowerUpGate {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 75;  // Adjust size as needed for the sprite
        this.height = 75;
        this.type = type;  //  Use the type passed to the constructor

        //  Load the sprite image
        this.image = new Image();
        this.image.src = "./static/images/cleaned_power_up_symbol-removebg-preview.png";

        //  Handle image loading errors
        this.image.onerror = () => {
            console.error("Failed to load power-up sprite image.");
        };
    }

    update() {
        this.y += 2; // Move the power-up down the screen
    }

    draw(ctx) {
        // Ensure the image is fully loaded before drawing
        if (this.image.complete && this.image.naturalWidth > 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Simple fallback rectangle
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    
        // Set text color based on the power-up type
        if (this.type === " +1" || this.type === " x2") {
            ctx.fillStyle = "green";  // Green for + and X
        } else if (this.type === " -1" || this.type === " /2") {
            ctx.fillStyle = "red";  // Red for - and /
        } else {
            ctx.fillStyle = "black";  // Default text color
        }
    
        // Draw the power-up type text on top of the sprite
        ctx.font = "20px Arial";
        ctx.fillText(this.type, this.x + this.width / 4, this.y + this.height / 1.5);
    }
    

    //  Collision detection with the player
    collideWith(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
}
