<template>
    <div>
        <div class="upBg">
            <label>新背景:</label><img :src="imgDataUrl">
        </div>
        <div class="psw6">
            <a href="javascript:" class="file">选择文件
                <input type="file" name="file" id="file" @change='uploadChange'>
            </a>
            <router-link :to="{ path: '/other'}">
                <button class="b2">返回</button>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "up-background",
        data() {
            return {
                imgDataUrl: '',
            }
        },
        methods: {
            getList() {
                this.$db6.find({}, (err, docs) => {
                    if (docs.length > 0) {
                        this.imgDataUrl=docs[0].img;
                    }
                })
            },

            uploadChange(event) {
                if (event.target.files.length > 0) {
                    this.files = event.target.files[0];  //提交的图片
                    this.getBase64(event.target, (url) => {
                        this.imgDataUrl = 'data:image/png;base64,' + url;   //显示的图片
                        this.$db6.remove({}, {multi: true}, function (err, numRemoved) {
                        });
                        this.$db6.insert({
                            img: this.imgDataUrl,
                        }, (err, newDocs) => {
                        });
                        alert('上传成功!');
                    });
                }
            },
            getBase64(file, callback) {
                var maxWidth = 1024;
                if (file.files && file.files[0]) {
                    var thisFile = file.files[0];
                    if (thisFile.size > 2019200) {
                        // mualert.alertBox("图片不能超过800K");
                        alert("图片不能超过2M");
                        return
                    }
                    ;
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var imgUrl = event.target.result;
                        var img = new Image();
                        img.onload = function () {
                            console.log(333)
                            var canvasId = 'canvasBase64Imgid',
                                canvas = document.getElementById(canvasId);
                            if (canvas != null) {
                                document.body.removeChild(canvas);
                            }
                            var canvas = document.createElement("canvas");
                            canvas.innerHTML = 'New Canvas';
                            canvas.setAttribute("id", canvasId);
                            canvas.style.display = 'none';
                            document.body.appendChild(canvas);
                            canvas.width = this.width;
                            canvas.height = this.height;
                            var imageWidth = this.width,
                                imageHeight = this.height;
                            if (this.width > maxWidth) {
                                imageWidth = maxWidth;
                                imageHeight = this.height * maxWidth / this.width;
                                canvas.width = imageWidth;
                                canvas.height = imageHeight;
                            }
                            var context = canvas.getContext('2d');
                            context.clearRect(0, 0, imageWidth, imageHeight);
                            context.drawImage(this, 0, 0, imageWidth, imageHeight);
                            var base64 = canvas.toDataURL('image/png', 1);
                            var imgbase = base64.substr(22);
                            callback(imgbase)
                            //this.imgUrl =
                        };
                        img.src = imgUrl;
                    };
                    reader.readAsDataURL(file.files[0]);
                }
            },
        },
        mounted() {
            this.getList();
        }
    }
</script>

<style scoped>
    .upBg {
        display: flex;
        justify-content: center;
    }

    .upBg img {
        width: 500px;
        height: 300px;
    }

    .upBg label {
        margin: 0 20px 0 0;
        font-size: 18px;
    }

    .psw6 {
        margin: 50px 0 0 100px;
    }

    .psw6 button {
        font-size: 18px;
        height: 40px;
        width: 100px;
        background: rgb(0, 125, 254);
        color: white;
        border: 1px solid rgb(0, 125, 254);
        border-radius: 5px;
        letter-spacing: 1px;
    }

    .file {
        position: relative;
        display: inline-grid;
        background: rgb(0, 125, 254);
        border: 1px solid rgb(0, 125, 254);
        border-radius: 4px;
        overflow: hidden;
        color: white;
        text-decoration: none;
        text-indent: 0;
        line-height: 20px;
        padding: 9px;
        width: 80px;
        font-size: 18px;
    }

    .file input {
        position: absolute;
        font-size: 18px;
        right: 0;
        top: 0;
        opacity: 0;
    }

</style>