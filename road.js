class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        const topLeft = { x: this.left, y: this.top };
        const topRight = { x: this.right, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };
        const bottomRight = { x: this.right, y: this.bottom };

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];

        this.startLineY = 100; // Y position of the start line
        this.finishLineY = null; // Initialize finish line position
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    }

    updateFinishLine(traffic) {
        const lastTrafficCarY = Math.min(...traffic.map(car => car.y));
        this.finishLineY = lastTrafficCarY - 200; // Position the finish line 200 units after the last traffic car
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

         // Draw the finish line if it has been set
         if (this.finishLineY !== null) {
            ctx.fillStyle = "red"; // Set color for the finish line
            ctx.fillRect(this.x - this.width / 2, this.finishLineY, this.width, 5); // Draw the finish line
        }

        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = this.left + (i * this.width) / this.laneCount;

            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });

        // Draw the start line
        this.drawLine(ctx, this.startLineY, "green");
    }

    drawLine(ctx, y, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.left, y);
        ctx.lineTo(this.right, y);
        ctx.stroke();
    }
}
