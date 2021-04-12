<div class="sitebar_list">
        <h4 class="sitebar_title">{dede:field name='id'/}——{dede:field name='typeurl'/}——{dede:field name='typename'/} </h4>
        <ul class="sitebar_list_ul">

{dede:channel type='son' noself='yes'} 
<li><a href="[field:typelink/]">[field:typename/] </a></li>
{/dede:channel} 


        </ul>
    </div>