

var app = new Vue({
    el:"#app",
    data:{
    
        page: "forum",
        threads_empty: "There are no threads for this category",
        posts_empty: "There are no posts for this thread",
        selected_category:"all",
        categories:[
            "all",
            "clothing",
            "books",
            "cards",
            "coins",
            "movies",
            "music"
        ],

        index: 0,

        postings:[],
        // for a new thread

        new_name: "",
        new_author: "",
        new_description: "",
        new_category: "all",
        new_author: "",
        new_body: "",

        url: "http://forum2021.codeschool.cloud",

        threads: [
            
        ]
    },

    created:function(){
        this.getThreads();
    },
    methods:{

        //getThreads
        getThreads: function(){
            fetch(this.url+"/thread").then(function(response){
                response.json().then(function(data){
                    console.log(data);
                    app.threads = data;
                });
            })
        },

        createThread: function(){
            var request_body= { 
                name: this.new_name,
                author: this.new_author,
                description: this.new_description,
                category: this.new_category
            };
            fetch(this.url +"/thread",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(request_body)
            }).then(function(response){
                console.log(request_body)
                if(response.status == 400){
                    response.json().then(function(data){
                        alert(data.msg)
                    })
                }else if(response.status == 201){
                    app.new_name="";
                    app.new_author="";
                    app.new_description="";
                    app.new_category = "all"
                    app.page = "forum";
                    app.getThreads();
                }
            });
        },
        

        // createThread: function(){
        //     // var for new thread
        //     // new_name.... etc
        //     var new_thread = {
        //         name: this.new_name,
        //         author: this.new_author,
        //         description: this.new_description,
        //         category: this.new_category,
        //         posts: []
        //     }
        //     this.threads.unshift(new_thread)
        //     this.new_name = "";
        //     this.new_author = "";
        //     this.new_description = "",
        //     this.category = "all";
        //     this.page = "forum";
        // },
        
        // deleteThread: function(index){
        //     this.threads.splice(index, 1)
        // },

        deleteThread: function( id ) {
            fetch(this.url +"/thread/"+ id,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(){app.getThreads()});
        },
        
        getPosts: function(thread_id){
            // this.postings = this.threads[index].posts
            // this.index = index;
            // this.page = "posts"
                fetch(this.url+"/thread/" + thread_id).then(function(response){
                    response.json().then(function(data){
                        console.log(data);
                        app.postings = data;
                    });
                }).then(function(){
                    app.page="posts";
                })
        },
        // get posts
            //change page to posts

        createPost: function(thread_id){
        //     var new_post = {
        //         author: this.new_author,
        //         body: this.new_body
        //     }
        //     this.postings.unshift(new_post)
        //     this.new_author = "",
        //     this.new_body = "",
        //     this.page = "posts"
        // },

        // deletePost: function(index){
        //     this.postings.splice(index, 1)
        // }
        var new_post= { 
            thread_id: thread_id,
            author: this.new_author,
            body: this.new_body,
        };
        fetch(this.url +"/post",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(new_post)
        }).then(function(){
            app.new_author="";
                app.new_body="";
                app.page = "posts";
                app.getPosts(thread_id);
        });
    },
    deletePost: function(post) {
        fetch(this.url +"/post/"+ post.thread_id + "/" + post._id ,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(){app.getPosts(post.thread_id)});
    },
    
    },
    computed:{
        sortedThreads: function(){
            // var chosenCategory = this.selected_category;
            if( this.selected_category == "all"){
                return this.threads
            } else {
                var filteredThreads = this.threads.filter(function(thread){
                    return thread.category == app.selected_category;
                });
                return filteredThreads;
            }

        }
    }
})