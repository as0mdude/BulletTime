class ArrayBoom extends Phaser.Scene {
    constructor() {
        super("arrayBoom");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 3;           // Don't create more than this many bullets

        

        this.playerScore = 0;

    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("playerchr", "ship_0012.png");
        this.load.image("bullet", "tile_0002.png");
        this.load.image("enemy_bullet", "tile_0003.png");
        this.load.image("enemy1", "ship_0001.png");
        this.load.image("enemy2", "ship_0000.png");

        this.load.image("fire1", "fire1.png");
        this.load.image("fire2", "fire2.png");
        this.load.image("fire3", "fire3.png");
        this.load.image("fire4", "fire4.png");
        this.load.image("fire5", "fire5.png");

        this.load.image("health", "health.png")

        this.load.audio('laser',  "laserLarge_000.ogg");
        this.load.audio('explosion',  "explosionCrunch_000.ogg");
        this.load.audio('forcefield',  "forceField_004.ogg");

        
    }

    create() {
        let my = this.my;

        my.text1 = this.add.text(650, 500, '0');
        my.text1.setScale(5, 5);

        my.text2 = this.add.text(100, 100, 'YOU DIED - Press "R" to restart the level.');
        my.text2.setColor("Red");
        my.text2.setScale(1.5, 1.5);
        my.text2.visible = false;


        my.highscoreText = this.add.text(100, 130, 'Highscores:');
        my.highscoreText.setColor("Red");
        my.highscoreText.setScale(3, 3);

        my.highscoreText.visible = false;


        my.score1 = this.add.text(100, 200, "filler");
        my.score1.setScale(4, 4);
        my.score1.setColor("Red");
        my.score1.visible = false;

        my.score2 = this.add.text(100, 250, "filler");
        my.score2.setScale(4, 4);
        my.score2.setColor("Red");
        my.score2.visible = false;

        my.score3 = this.add.text(100, 300, "filler");
        my.score3.setScale(4, 4);
        my.score3.setColor("Red");
        my.score3.visible = false;

        my.score4 = this.add.text(100, 350, "filler");
        my.score4.setScale(4, 4);
        my.score4.setColor("Red");
        my.score4.visible = false;

        my.score5 = this.add.text(100, 400, "filler");
        my.score5.setScale(4, 4);
        my.score5.setColor("Red");
        my.score5.visible = false;


        my.laser = this.sound.add('laser');
        my.explosion = this.sound.add('explosion');
        my.forcefield = this.sound.add('forcefield');


        
        
        

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "playerchr");
        my.sprite.player.setScale(2);

        
        my.sprite.enemy1 = this.add.sprite(Phaser.Math.Clamp(Math.random() * config.width, 50, 750), 40, "enemy1");
        my.sprite.enemy1.setScale(2);
        my.sprite.enemy1.setAngle(180);

        my.sprite.enemy2 = this.add.sprite(Phaser.Math.Clamp(Math.random() * config.width, 50, 750), 40, "enemy2");
        my.sprite.enemy2.setScale(2);
        my.sprite.enemy2.setAngle(180);


        

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presseads

        // Create explosion animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "fire1" },
                { key: "fire2" },
                { key: "fire3" },
                { key: "fire4" },
                { key: "fire5" },
            ],
            framerate: 30,
            repeat: 1,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.restart = this.input.keyboard.addKey("R");

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 7;
        this.bulletSpeed = 20;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>SpeedShooter by Vincent Fu</h2><br>A: left // D: right // Space: fire/emit // R: restart the level after death'

        this.enemy1_heading = true;

        my.sprite.enemybullet1 = this.add.sprite(-10, -10, "enemy_bullet");
        my.sprite.enemybullet1.setAngle(180);
        my.sprite.enemybullet1.setScale(2);
        this.enemy1bulletSpeed = 10;
        my.sprite.enemybullet1.visible = false;
        this.enemy1_bulletActive = false;

        this.enemy2_heading = false;
        my.sprite.enemybullet21 = this.add.sprite(-10, -10, "enemy_bullet");
        my.sprite.enemybullet21.setAngle(130);
        my.sprite.enemybullet21.setScale(2);

        my.sprite.enemybullet22 = this.add.sprite(-10, -10, "enemy_bullet");
        my.sprite.enemybullet22.setAngle(180);
        my.sprite.enemybullet22.setScale(2);

        my.sprite.enemybullet23 = this.add.sprite(-10, -10, "enemy_bullet");
        my.sprite.enemybullet23.setAngle(230);
        my.sprite.enemybullet23.setScale(2);


        this.enemy2bulletSpeed = 7;
        my.sprite.enemybullet21.visible = false;
        my.sprite.enemybullet22.visible = false;
        my.sprite.enemybullet23.visible = false;
        this.enemy2_bulletActive = false;






        my.sprite.healthicon1 = this.add.sprite(80, 550, "health");
        my.sprite.healthicon1.setScale(3);
        my.sprite.healthicon2 = this.add.sprite(120, 550, "health");
        my.sprite.healthicon2.setScale(3);
        my.sprite.healthicon3 = this.add.sprite(160, 550, "health");
        my.sprite.healthicon3.setScale(3);
        my.sprite.healthicon4 = this.add.sprite(200, 550, "health");
        my.sprite.healthicon4.setScale(3);

        this.playerHealth = 100;

        this.largestKey = 0;
        
        

    }

    update() {
        let my = this.my;

        console.log(this.playerHealth);

        if(my.sprite.enemy1.y > 600 || my.sprite.enemy2.y > 600){
            this.playerHealth == 0;
        }

        switch(true) {
            case this.playerScore >= 200:
                this.cameras.main.setBackgroundColor('#8F00FF');
                break;
            case this.playerScore >= 150:
                this.cameras.main.setBackgroundColor('#FFA500');
                break;
            case this.playerScore >= 100:
                this.cameras.main.setBackgroundColor('#FFFF00');
                break;
            case this.playerScore >= 50:
                this.cameras.main.setBackgroundColor('#800080');
                break;
            default:
                
                break;
        }

        
        if (this.collides(my.sprite.player, my.sprite.enemybullet1) || this.collides(my.sprite.player, my.sprite.enemybullet21) || this.collides(my.sprite.player, my.sprite.enemybullet22) || this.collides(my.sprite.player, my.sprite.enemybullet23)){
            // Handle player-enemy bullet collision here
            //this.enemyKilled++;
            //my.text1.setText(this.enemyKilled);

            this.playerHealth -= 25;

            if(this.playerHealth != 0){
                my.forcefield.play();
            }
            
            // Reset the enemybullet1
            my.sprite.enemybullet1.visible = false;
            this.enemy1_bulletActive = false;

            my.sprite.enemybullet21.visible = false;
            this.enemy21_bulletActive = false;

            my.sprite.enemybullet22.visible = false;
            this.enemy22_bulletActive = false;

            my.sprite.enemybullet23.visible = false;
            this.enemy23_bulletActive = false;

            if(this.playerHealth == 0){
                my.sprite.player.visible = false;
                my.explosion.play();

                this.puff = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "fire1").setScale(4).play("puff");
                    // Incrementing the key to store the next score
                let key = localStorage.length + 1;
                localStorage.setItem(key.toString(), this.playerScore);
    
                // Retrieve and sort scores
                let scoresArray = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    const value = parseInt(localStorage.getItem(key), 10);
                    scoresArray.push(value);
                }
                scoresArray.sort((a, b) => b - a);
    
                // Save top 5 scores
                const top5Scores = scoresArray.slice(0, 5);
                localStorage.clear();
                
                for (let i = 0; i < top5Scores.length; i++) {
                    localStorage.setItem((i + 1).toString(), top5Scores[i]);
                }
                console.log(top5Scores);
    
                const scoreTexts = [this.my.score1, this.my.score2, this.my.score3, this.my.score4, this.my.score5];
    
                for(let i = 0; i<5; i++){
                    scoreTexts[i].setText(top5Scores[i]);
                    scoreTexts[i].visible = true;
                }
    
                this.my.highscoreText.visible = true;
    
                this.my.text2.visible = true;
            }

        }

        

       

        switch(true){
            case this.playerHealth>=100:
                my.sprite.healthicon4.visible = true;
                my.sprite.healthicon3.visible = true;
                my.sprite.healthicon2.visible = true;
                my.sprite.healthicon1.visible = true;
                break;
            case this.playerHealth>=75:
                my.sprite.healthicon4.visible = false;
                break;
            case this.playerHealth>=50:
                my.sprite.healthicon3.visible = false;
                break;
            case this.playerHealth>=25:
                my.sprite.healthicon2.visible = false;
                break;
            case this.playerHealth == 0:
                my.sprite.healthicon1.visible = false;
                break;
        }
        

        if (!this.enemy1_bulletActive) {
            // Set the active flag to true
            this.enemy1_bulletActive = true;
            // Set the position of the bullet to be the location of the player
            // Offset by the height of the sprite, so the "bullet" comes out of
            // the top of the player avatar, not the middle.
            my.sprite.enemybullet1.x = my.sprite.enemy1.x;
            my.sprite.enemybullet1.y = my.sprite.enemy1.y - my.sprite.enemy1.displayHeight/2;
            my.sprite.enemybullet1.visible = true;
        }

        if (this.enemy1_bulletActive) {
            my.sprite.enemybullet1.y += this.enemy1bulletSpeed;
            // Is the bullet off the top of the screen?
            if (my.sprite.enemybullet1.y > 600) {
                // make it inactive and invisible
                this.enemy1_bulletActive = false;
                my.sprite.enemybullet1.visible = false;

            }
        }

        if (!this.enemy21_bulletActive && !this.enemy22_bulletActive) {
            // Set the active flag to true
            this.enemy21_bulletActive = true;
            this.enemy22_bulletActive = true;
            this.enemy23_bulletActive = true;
            // Set the position of the bullet to be the location of the player
            // Offset by the height of the sprite, so the "bullet" comes out of
            // the top of the player avatar, not the middle.
            my.sprite.enemybullet21.x = my.sprite.enemy2.x;
            my.sprite.enemybullet21.y = my.sprite.enemy2.y - my.sprite.enemy2.displayHeight/2;
            my.sprite.enemybullet21.visible = true;

            my.sprite.enemybullet22.x = my.sprite.enemy2.x;
            my.sprite.enemybullet22.y = my.sprite.enemy2.y - my.sprite.enemy2.displayHeight/2;
            my.sprite.enemybullet22.visible = true;

            my.sprite.enemybullet23.x = my.sprite.enemy2.x;
            my.sprite.enemybullet23.y = my.sprite.enemy2.y - my.sprite.enemy2.displayHeight/2;
            my.sprite.enemybullet23.visible = true;
        }

        if (this.enemy21_bulletActive && this.enemy22_bulletActive) {
            my.sprite.enemybullet21.y += this.enemy2bulletSpeed;
            my.sprite.enemybullet21.x += this.enemy2bulletSpeed;

            my.sprite.enemybullet23.y += this.enemy2bulletSpeed;
            my.sprite.enemybullet23.x -= this.enemy2bulletSpeed;


            my.sprite.enemybullet22.y += this.enemy2bulletSpeed;
            
            // Is the bullet off the top of the screen?
            if (my.sprite.enemybullet21.y > 600) {
                // make it inactive and invisible
                this.enemy21_bulletActive = false;
                my.sprite.enemybullet21.visible = false;

                this.enemy22_bulletActive = false;
                my.sprite.enemybullet22.visible = false;

                this.enemy23_bulletActive = false;
                my.sprite.enemybullet23.visible = false;
            }
        }


        


        
        if(my.sprite.enemy1.x >= 750){
            my.sprite.enemy1.y+=65;
            my.sprite.enemy1.x-=9+(0.10*this.playerScore);
            this.enemy1_heading = false;
        }else if(my.sprite.enemy1.x <= 50){
            my.sprite.enemy1.y+=65;
            my.sprite.enemy1.x+=9+(0.10*this.playerScore);
            this.enemy1_heading = true;
        }else if(this.enemy1_heading == true){
            my.sprite.enemy1.x+=9+(0.10*this.playerScore);
        }else if(this.enemy1_heading == false){
            my.sprite.enemy1.x-=9+(0.10*this.playerScore);
        }

        if(my.sprite.enemy2.x >= 750){
            my.sprite.enemy2.y+=65;
            my.sprite.enemy2.x-=8+(0.10*this.playerScore);
            this.enemy2_heading = false;
        }else if(my.sprite.enemy2.x <= 50){
            my.sprite.enemy2.y+=65;
            my.sprite.enemy2.x+=8+(0.10*this.playerScore);
            this.enemy2_heading = true;
        }else if(this.enemy2_heading == true){
            my.sprite.enemy2.x+=8+(0.10*this.playerScore);
        }else if(this.enemy2_heading == false){
            my.sprite.enemy2.x-=8+(0.10*this.playerScore);
        }




        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed;
            }
        }

        
        if (Phaser.Input.Keyboard.JustDown(this.restart) && this.playerHealth <= 0) {
            
                my.text2.visible = false;
                
                this.playerHealth = 100;
                this.playerScore = 0;
                my.text1.setText(this.playerScore);
                this.my.sprite.enemy1.visible = true;
                this.my.sprite.enemy1.x = Phaser.Math.Clamp(Math.random() * config.width, 50, 750);
                this.my.sprite.enemy1.y= 40;
                this.enemy1_heading = true;

                this.my.sprite.enemy2.visible = true;
                this.my.sprite.enemy2.x = Phaser.Math.Clamp(Math.random() * config.width, 50, 750);
                this.my.sprite.enemy2.y= 40;
                this.enemy2_heading = true;
                


                const healthIcon = [my.sprite.healthicon4, my.sprite.healthicon3, my.sprite.healthicon2, my.sprite.healthicon1];
                
                for(let i = 0; i < 4; i++){
                    healthIcon[i].visible = true;
                }

                const scoreVisibility = [my.score1, my.score2, my.score3, my.score4, my.score5];
                
                for(let i = 0; i < 5; i++){
                    scoreVisibility[i].visible = false;
                }

                my.highscoreText.visible = false;


                my.sprite.player.x = game.config.width/2;
                my.sprite.player.y = game.config.height - 40;
                my.sprite.player.visible = true;

                this.cameras.main.setBackgroundColor('#87CEEB');

                
            
            
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.laser.play();


                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "bullet")
                );
            }

            
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        // Check for collision with the hippo
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.enemy1, bullet)) {
                // start animation
                my.explosion.play();
                this.puff = this.add.sprite(my.sprite.enemy1.x, my.sprite.enemy1.y, "fire1").setScale(4).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.enemy1.visible = false;
                my.sprite.enemy1.x = -100;
                this.playerScore = this.playerScore+=2;
                my.text1.setText(this.playerScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    if(my.sprite.enemy1.visible == false && my.sprite.enemy2.visible == false){
                        this.my.sprite.enemy1.visible = true;
                        this.my.sprite.enemy1.x = Phaser.Math.Clamp(Math.random() * config.width, 50, 750);
                        this.my.sprite.enemy1.y= 40;
                        this.enemy1_heading = true;

                        this.my.sprite.enemy2.visible = true;
                        this.my.sprite.enemy2.x = Phaser.Math.Clamp(Math.random() * config.width, 50, 750);
                        this.my.sprite.enemy2.y= 40;
                        this.enemy2_heading = true;
                    }
                }, this);

            } else if (this.collides(my.sprite.enemy2, bullet)) {
                // start animation
                my.explosion.play();
                this.puff = this.add.sprite(my.sprite.enemy2.x, my.sprite.enemy2.y, "fire1").setScale(4).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.enemy2.visible = false;
                my.sprite.enemy2.x = -100;
                this.playerScore = this.playerScore+=3;
                my.text1.setText(this.playerScore);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    if(my.sprite.enemy1.visible == false && my.sprite.enemy2.visible == false){
                        this.my.sprite.enemy1.visible = true;
                        this.my.sprite.enemy1.x = Phaser.Math.Clamp(Math.random() * config.width, 50, 750);
                        this.my.sprite.enemy1.y= 40;
                        this.enemy1_heading = true;

                        this.my.sprite.enemy2.visible = true;
                        this.my.sprite.enemy2.x = Phaser.Math.Clamp(Math.random() * config.width, 50, 750);
                        this.my.sprite.enemy2.y= 40;
                        this.enemy2_heading = true;
                    }
                    
                    
                }, this);

            }
        }
    }

    

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    
}