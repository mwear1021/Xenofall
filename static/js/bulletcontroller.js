import Bullet from "./bullet.js";

export default class BulletController {
    bullets = [];
    timerTillNextBullet = 0;

    constructor(canvas) {
        this.canvas = canvas;
    }

    shoot(x, y, speed, damage, delay) {
        if(this.timerTillNextBullet <= 0){
            this.bullets.push(new Bullet(x, y, speed, damage));
            this.timerTillNextBullet = delay;
        }

        this.timerTillNextBullet--;
    }

    // isBulletOffScreen(bullet) {
    //     return bullet.y <= -bullet.height;
    // }


    draw(ctx) {
        // console.log(this.bullets.length);
        this.bullets.forEach((bullet) => {
            if (this.isBulletOffScreen(bullet)){
                const index = this.bullets.indexOf(bullet);
               this.bullets.splice(index,1);
            }
            bullet.draw(ctx);
        });
    }
    
    collideWith(sprite) {
        const bulletsToKeep = [];
        let collided = false;
    
        this.bullets.forEach(bullet => {
            if (bullet.collideWith(sprite)) {
                collided = true;
            } else {
                bulletsToKeep.push(bullet);
            }
        });
    
        this.bullets = bulletsToKeep;
        return collided;
    }
    


    isBulletOffScreen(bullet) {
        return bullet.y <= -bullet.height;
    }
}