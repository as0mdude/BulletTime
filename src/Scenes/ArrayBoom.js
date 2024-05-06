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
        this.maxBullets = 10;           // Don't create more than this many bullets

        

        this.enemyKilled = 0;

        
        
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("playerchr", "ship_0012.png");
        this.load.image("bullet", "tile_0002.png");
        this.load.image("enemy_bullet", "tile_0003.png");
        this.load.image("enemy1", "ship_0001.png");

        this.load.image("fire1", "fire1.png");
        this.load.image("fire2", "fire2.png");
        this.load.image("fire3", "fire3.png");
        this.load.image("fire4", "fire4.png");
        this.load.image("fire5", "fire5.png");

        this.load.image("health", "health.png")
    }

    create() {
        let my = this.my;

        my.text1 = this.add.text(650, 500, '0');
        my.text1.setScale(5, 5);
        

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "playerchr");
        my.sprite.player.setScale(2);

        my.sprite.enemy1 = this.add.sprite(game.config.width/2, 40, "enemy1");
        my.sprite.enemy1.setScale(2);
        my.sprite.enemy1.setAngle(180);

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presseads

        // Create white puff animation
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

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 10;
        this.bulletSpeed = 20;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Array Boom.js</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

        this.enemy1_heading = true;

        my.sprite.enemybullet1 = this.add.sprite(-10, -10, "enemy_bullet");
        my.sprite.enemybullet1.setAngle(180);
        my.sprite.enemybullet1.setScale(2);
        this.enemy1bulletSpeed = 10;
        my.sprite.enemybullet1.visible = false;
        this.enemy1_bulletActive = false;



        my.sprite.healthicon1 = this.add.sprite(80, 550, "health");
        my.sprite.healthicon1.setScale(3);
        my.sprite.healthicon2 = this.add.sprite(120, 550, "health");
        my.sprite.healthicon2.setScale(3);
        my.sprite.healthicon3 = this.add.sprite(160, 550, "health");
        my.sprite.healthicon3.setScale(3);
        my.sprite.healthicon4 = this.add.sprite(200, 550, "health");
        my.sprite.healthicon4.setScale(3);

        this.playerHealth = 100;

    }

    update() {
        let my = this.my;


        
        if (this.collides(my.sprite.player, my.sprite.enemybullet1)) {
            // Handle player-enemy bullet collision here
            //this.enemyKilled++;
            //my.text1.setText(this.enemyKilled);

            this.playerHealth -= 25;
            
            // Reset the enemybullet1
            my.sprite.enemybullet1.visible = false;
            this.enemy1_bulletActive = false;

            if(this.playerHealth == 0){
                my.sprite.player.visible = false;
                this.puff = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "fire1").setScale(4).play("puff");

            }

        }

        if(this.playerHealth==100){
            my.sprite.healthicon4.visible = true;
            my.sprite.healthicon3.visible = true;
            my.sprite.healthicon2.visible = true;
            my.sprite.healthicon1.visible = true;
            

        }else if(this.playerHealth==75){
            my.sprite.healthicon4.visible = false;
            my.sprite.healthicon3.visible = true;
            my.sprite.healthicon2.visible = true;
            my.sprite.healthicon1.visible = true;
            

        }else if(this.playerHealth==50){
            my.sprite.healthicon4.visible = false;
            my.sprite.healthicon3.visible = false;
            my.sprite.healthicon2.visible = true;
            my.sprite.healthicon1.visible = true;
            

        }else if(this.playerHealth==25){
            my.sprite.healthicon4.visible = false;
            my.sprite.healthicon3.visible = false;
            my.sprite.healthicon2.visible = false;
            my.sprite.healthicon1.visible = true;
            

        }else{
            my.sprite.healthicon4.visible = false;
            my.sprite.healthicon3.visible = false;
            my.sprite.healthicon2.visible = false;
            my.sprite.healthicon1.visible = false;            

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


        
        if(my.sprite.enemy1.x >= 750){
            my.sprite.enemy1.y+=65;
            my.sprite.enemy1.x-=5;
            this.enemy1_heading = false;
        }else if(my.sprite.enemy1.x <= 50){
            my.sprite.enemy1.y+=65;
            my.sprite.enemy1.x+=5;
            this.enemy1_heading = true;
        }else if(this.enemy1_heading == true){
            my.sprite.enemy1.x+=5;
        }else if(this.enemy1_heading == false){
            my.sprite.enemy1.x-=5;
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

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "bullet")
                );
            }
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        // Check for collision with the hippo
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.enemy1, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.enemy1.x, my.sprite.enemy1.y, "fire1").setScale(4).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.enemy1.visible = false;
                my.sprite.enemy1.x = -100;
                this.enemyKilled = this.enemyKilled+=2;
                my.text1.setText(this.enemyKilled);
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemy1.visible = true;
                    this.my.sprite.enemy1.x = Phaser.Math.Clamp(Math.random() * config.width, 50, 750);
                    this.my.sprite.enemy1.y= 40;
                    this.enemy1_heading = true;
                    
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
         