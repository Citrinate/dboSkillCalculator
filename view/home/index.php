<script type="text/javascript">
    var master_class = <?php echo $classes[$class]["class_id"]; ?>;
    var url = "<?php echo $build; ?>";
</script>

<table class="titlebar">
    <tr>
        <td class="titlebar-topleft"></td>
        <td class="titlebar-top"></td>
        <td class="titlebar-topright"></td>
    </tr>
    <tr>
        <td class="titlebar-left"></td>
        <td class="search-class">
            <?php foreach($classes as $item): ?>
                <?php if(isset($item["master_classes"])): ?>
                    <div class="search-class-row">
                        <?php foreach($item["master_classes"] as $master_class): ?>
                            <a href="<?php echo "{$base_url}?lang={$lang}&class={$master_class}"?>">
                                <div>
                                    <img class="search-class-icon" src="img/<?php echo $classes[$master_class]["class_id"]; ?>_small.png">
                                    <?php echo $classes[$master_class]["display_name"]; ?>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
        </td>
        <td class="titlebar-right"></td>
    </tr>
    <tr>
        <td class="titlebar-bottomleft"></td>
        <td class="titlebar-bottom"></td>
        <td class="titlebar-bottomright"></td>
    </tr>
</table>
<br>
<div class="skill-calc-intro" style="float: left;">
    Use the skill calculator below to experiment with how to spend your SP (skill points) in-game. Left click to spend
    a SP and right click to remove one.  Skills you can't remove points from are either required and/or cost no SP to
    learn.
    <br>
    <br>
    <div class="sp-remaining">
        Total SP Spent: <span id="remainingpoints">0</span>/<?php echo $skill_point_count; ?> (<u><a href="javascript:void(0)" onclick="reset(0, 0);">Reset</a></u>)
    </div>
</div>
<table width="100%" height="1px">
    <tr>
        <td height="1px">
            <div class="class-tree">
                <table>
                    <tr>
                        <td>
                            <table oncontextmenu="return false" onselectstart="return false" ondragstart="return false" class="titlebar">
                                <tbody>
                                    <tr>
                                        <td class="titlebar-topleft"></td>
                                        <td class="titlebar-top"></td>
                                        <td class="titlebar-topright"></td>
                                    </tr>
                                    <tr>
                                        <td class="titlebar-left"></td>
                                        <td>
                                            <div class="class-name">
                                                <img src="img/<?php echo $classes[$classes[$class]["basic_class"]]["class_id"]; ?>_small.png">
                                                <?php echo $classes[$classes[$class]["basic_class"]]["display_name"]; ?> Skills
                                            </div>
                                            <div class="class-sp">
                                                <span id="classpoints">0</span> SP (<u><a href="javascript:void(0)" onclick="reset(1, 1);">Reset</a></u>)
                                            </div>
                                        </td>
                                        <td class="titlebar-right"></td>
                                    </tr>
                                    <tr>
                                        <td class="titlebar-bottomleft"></td>
                                        <td class="titlebar-bottom"></td>
                                        <td class="titlebar-bottomright"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="8px"></td>
                    </tr>
                    <tr>
                        <td>
                            <table oncontextmenu="return false" onselectstart="return false" ondragstart="return false" class="titlebar"><tbody><tr><td class="titlebar-topleft"></td><td class="titlebar-top"></td><td class="titlebar-topright"></td></tr>
                            <tr><td class="titlebar-left"></td><td><table class="skill-tree"><tr><td id="base-tree"></td></tr></table></td><td class="titlebar-right"></td></tr>
                            <tr><td class="titlebar-bottomleft"></td><td class="titlebar-bottom"></td><td class="titlebar-bottomright"></td></tr></tbody></table>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="master-class-tree">
                <table width="460px">
                    <tr>
                        <td>
                            <table oncontextmenu="return false" onselectstart="return false" ondragstart="return false" class="titlebar">
                                <tbody>
                                    <tr>
                                        <td class="titlebar-topleft"></td>
                                        <td class="titlebar-top"></td>
                                        <td class="titlebar-topright"></td>
                                    </tr>
                                    <tr>
                                        <td class="titlebar-left"></td>
                                        <td>
                                            <div class="class-name">
                                                <img src="img/<?php echo $classes[$class]["class_id"]; ?>_small.png"> <?php echo $classes[$class]["display_name"]; ?> Skills
                                            </div>
                                            <div class="class-sp">
                                                <span id="masterclasspoints">0</span> SP (<u><a href="javascript:void(0)" onclick="reset(2, 1);">Reset</a></u>)
                                            </div>
                                        </td>
                                        <td class="titlebar-right"></td>
                                    </tr>
                                    <tr>
                                        <td class="titlebar-bottomleft"></td>
                                        <td class="titlebar-bottom"></td>
                                        <td class="titlebar-bottomright"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="8px"></td>
                    </tr>
                    <tr>
                        <td>
                            <table oncontextmenu="return false" onselectstart="return false" ondragstart="return false" class="titlebar">
                                <tbody>
                                    <tr>
                                        <td class="titlebar-topleft"></td>
                                        <td class="titlebar-top"></td>
                                        <td class="titlebar-topright"></td>
                                    </tr>
                                    <tr>
                                        <td class="titlebar-left"></td>
                                        <td>
                                            <table class="skill-tree">
                                                <tr>
                                                    <td id="mc-tree"></td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td class="titlebar-right"></td>
                                    </tr>
                                    <tr>
                                        <td class="titlebar-bottomleft"></td>
                                        <td class="titlebar-bottom"></td>
                                        <td class="titlebar-bottomright"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="16px"></td>
                    </tr>
                    <tr>
                        <td>
                            <a href="" id="calcurl" style="text-decoration: none;">
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <td class="lightblue-button-top-left"></td>
                                            <td class="lightblue-button-top">
                                                <a href="" id="calcurl2" style="text-decoration: none; color: #fff;">Link to this Build</a>
                                            </td>
                                            <td class="lightblue-button-top-right"></td>
                                        </tr>
                                        <tr>
                                            <td class="lightblue-button-bottom-left"></td>
                                            <td class="lightblue-button-bottom"></td>
                                            <td class="lightblue-button-bottom-right"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </a>
                            <div class="release">
                                After you've finished working on your build, use the link above to share it with others
                                or to save it for later.  To copy the link, right click on the button above and select
                                "Copy Link".
                            </div>
                            <br>
                            Tooltip Language:
                            <?php foreach($langs as $key => $data): ?>
                                &nbsp;&nbsp;<a href="<?php echo "{$base_url}?lang={$key}"?>" id="<?php echo $key; ?>url"><img src="img/<?php echo $key; ?>.png" title="<?php echo $data; ?>" style="vertical-align: text-top;"></a>
                            <?php endforeach; ?>
                        </td>
                    </tr>
                </table>
            </div>
        </td>
    </tr>
</table>

<script type="text/javascript" src="js/strings/skill_calc_<?php echo $lang; ?>.js"></script>