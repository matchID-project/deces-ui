<div class="modal" class:is-active={active}>
    <div class="modal-background" on:click={toggleModal}></div>
    <div class="modal-card">
        <header class="modal-card-head" on:close={toggleModal}>
            <div class="modal-card-title">
                {title}
            </div>
            <button class="delete" aria-label="close" on:click={toggleModal}></button>
        </header>
        <section class="modal-card-body">
            <div class="content">
                <slot/>
            </div>
        </section>
        <footer class="modal-card-foot">
        </footer>
    </div>
</div>

<script>
    export let title;
    export let active=false;
    function toggleModal() {
        active= !active
    }
</script>

<style>
    .modal,
    .modal-background {
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0
    }
    .modal {
    align-items:center;
    display:none;
    flex-direction:column;
    justify-content:center;
    overflow:hidden;
    position:fixed;
    z-index:40
    }
    .modal.is-active {
    display:flex
    }
    .modal-background {
    background-color:rgba(10,10,10,.86)
    }
    .modal-card,
    .modal-content {
    margin:0 20px;
    max-height:calc(100vh - 160px);
    overflow:auto;
    position:relative;
    width:100%
    }
    @media print,screen and (min-width:769px) {
    .modal-card,
    .modal-content {
        margin:0 auto;
        max-height:calc(100vh - 40px);
        width:640px
    }
    }
    .modal-close {
        background:none;
        height:40px;
        position:fixed;
        right:20px;
        top:20px;
        width:40px
    }
    .modal-card {
        display:flex;
        flex-direction:column;
        max-height:calc(100vh - 40px);
        overflow:hidden;
        -ms-overflow-y:visible
    }
    .modal-card-foot,
    .modal-card-head {
        align-items:center;
        background-color:#f5f5f5;
        display:flex;
        flex-shrink:0;
        justify-content:flex-start;
        padding: 20px;
        position:relative
    }
    .modal-card-head {
        border-bottom:1px solid #dbdbdb;
        border-top-left-radius:6px;
        border-top-right-radius:6px;
    /* padding: 0px 20px 0px 20px; */
    }
    .modal-card-title {
        color:#363636;
        flex-grow:1;
        flex-shrink:0;
        font-size:1.5rem;
        line-height:1
    }
    .modal-card-foot {
        border-bottom-left-radius:6px;
        border-bottom-right-radius:6px;
        border-top:1px solid #dbdbdb
    }
    .modal-card-foot .button:not(:last-child) {
        margin-right:.5em
    }
    .modal-card-body {
        -webkit-overflow-scrolling:touch;
        background-color:#fff;
        flex-grow:1;
        flex-shrink:1;
        overflow:auto;
        padding:20px
    }
    .modal-container {
        z-index:100;
        position:fixed
    }

    .delete {
        -moz-appearance:none;
        -webkit-appearance:none;
        background-color:rgba(10,10,10,.2);
        border:none;
        border-radius:290486px;
        cursor:pointer;
        pointer-events:auto;
        display:inline-block;
        flex-grow:0;
        flex-shrink:0;
        font-size:0;
        height:20px;
        max-height:20px;
        max-width:20px;
        min-height:20px;
        min-width:20px;
        outline:none;
        position:relative;
        vertical-align:top;
        width:20px
    }
    .delete:after,
    .delete:before {
        background-color:#fff;
        content:"";
        display:block;
        left:50%;
        position:absolute;
        top:50%;
        transform:translateX(-50%) translateY(-50%) rotate(45deg);
        transform-origin:center center
    }
    .delete:before {
        height:2px;
        width:50%
    }
    .delete:after {
        height:50%;
        width:2px
    }
    .delete:focus,
    .delete:hover {
        background-color:rgba(10,10,10,.3)
    }

</style>