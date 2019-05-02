var NAME_ID         = 0;
var USAGE_TYPE      = 1;
var DAMAGE_TYPE     = 2;
var SKILL_TYPE      = 3;
var LEVEL           = 4;
var TARGET_AREA     = 5;
var TARGET          = 6;
var MAX_TARGETS     = 7;
var AOE             = 8;
var AOE_RADIUS_1    = 9;
var AOE_RADIUS_2    = 10;
var EFFECT_ID_1     = 11;
var EFFECT_ID_2     = 12;
var EFFECT_PERC_1   = 13;
var EFFECT_PERC_2   = 14;
var EFFECT_VAL_1    = 15;
var EFFECT_VAL_2    = 16;
var RP_ID_1         = 17;
var RP_ID_2         = 18;
var RP_ID_3         = 19;
var RP_ID_4         = 20;
var RP_ID_5         = 21;
var RP_ID_6         = 22;
var RP_VAL_1        = 23;
var RP_VAL_2        = 24;
var RP_VAL_3        = 25;
var RP_VAL_4        = 26;
var RP_VAL_5        = 27;
var RP_VAL_6        = 28;
var LEVEL_REQ       = 29;
var SP_COST         = 30;
var SKILL_REQ_1     = 31;
var SKILL_REQ_2     = 32;
var SKILL_REQ_3     = 33;
var SKILL_REQ_4     = 34;
var EQUIP           = 35;
var LP_COST         = 36;
var EP_COST         = 37;
var CAST_TIME       = 38;
var COOLDOWN        = 39;
var DURATION        = 40;
var RANGE           = 41;
var DESCRIPTION_ID  = 42;
var NEXT_ID         = 43;
var USABLE_STATE    = 44;
var URL_POS         = 45;

var ready = 0; // tree structure finished
var initv = 1; // 1 when setting up the tree
var disablesave = 1; // whether or not to update url
var tooltip = new Array(); // array that contains cached tooltip data
var show_info = 0;
var current = 0; // current # of points
var max = 70; // max # of points
var info_height = 0;
var info_width = 0;
var mouse = new Array();
var info = new Array();
var base_class = "";
var class_name = "";
var url_index = 0;
var site_url = "";
var frame_url = "";
var is_local = 1;
var complete = new Array();

var target_array = [
    [ // Self 0
        [
            1 // Self cast
        ],
        [
            0 // Blank
        ]
    ],
    [// Enemies 1
        [
            -1,
            2, // All Enemies within %dM on %d targets
            3 // All Enemies within %d x %dM of the surrounding landscape on %d targets"
        ],
        [
            9, // Target
            11, // All Enemies within %dM of the Target on %d targets
            12, // All Enemies around the Target within a %d x %dM on %d targets
            13, // Affects specified Target &%dM in a Straight Line on %d targets
            35 // Target range: %d targets within %dM hit
        ],
        [
            -1,
            20, // All Enemies within %dM of the Area on %d targets
            21 // All Enemies around the Area within a %d x %dM on %d targets
        ]
    ],
    [ // Allies 2
        [
            -1,
            4, // All allies within %dM on %d targets
            5 // All Allies within %d x %dM of the surrounding landscape on %d targets
        ],
        [
            14, // Affects one ally
            15, // All Members within %dM of the target on %d targets
            16 // All Members around the Target within a %d x %dM on %d targets
        ],
        [
            -1,
            22, // All members within %dM of the Area on %d targets
            23 // All Members around the Area within a %d x %dM on %d targets
        ]
    ],
    [ // Party Members 3
        [
            -1,
            7, // All Party Members near the Caster within %dM on %d targets
            8 // All Party Members around the Caster within a %d x %dM on %d targets
        ],
        [
            17, // Affects One Group Member
            18, // All Party Members within %dM of the Target on %d targets
            19 // All %d Party Members within %dM of the Target on %d targets
        ],
        [
            -1, // All Party Members within %dm of the Area on %d targets
            24, // All Party Members around the Area within a %dx%dM on %d targets
            25
        ]
    ],
    [ // ??? 4
    ],
    [ // Everyone 5
        [
            -1,
            26, // All enemies within %dM on %d targets
            27 // Everyone all around the caster within a range of %d x %dM on %d targets
        ],
        [
            28, // Target
            29, // Everyone within %dM of theTarget on %d targets
            30 // Everyone around the Target within a %d x %dM on %d targets
        ],
        [
            -1,
            31, // Everyone within %dM of the Area on %d targets
            32 // Everyone around the area within a %d x %dM on %d targets
        ]
    ],
    [ // Pet 6
        [],
        [
            36 // Own Pet Only
        ]
    ]
];

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun /*, thisp*/)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}

function buildTree(tree_class, tree_container)
// builds a tree for tree_class and puts it inside of tree_container
{
    var width = -1;
    var column = 1;
    var row = 1;
    var output = '<table class="inner-tree"><tr>';
    tree_class = tree_class.toLowerCase();

    st[tree_class].forEach(function(value)
    {
        if(width == -1) {
            width = value;
        } else {
            output += '<td><div class="skill-container">';

            if(value != -1) {
                value_index = (row - 1) * width + column;

                if(!isNaN(Number(value))) {
                    //output += ' id="shell' + value + '">';
                    output += '<div id="shell' + value + '" class="skill-shell"></div><div id="skillicon' + value + '" class="skill-icon ' + tree_class + ' icon-' + row + '-' + column + '"></div><div id="glow' + value + '"></div>';

                    // get max level of skill
                    max_points = 1;
                    next_level = sd[value][NEXT_ID];

                    while(next_level in sd) {
                        next_level = sd[next_level][NEXT_ID];
                        max_points++;
                    }

                    if(max_points != 1 || sd[value][SP_COST] != 0) {
                        output += '<div class="currentpoints" id="currentpoints' + value + '">0</div><div class="maxpoints" id="maxpoints' + value + '">' + max_points + '</div>';
                    } else {
                        output += '<div class="currentpoints" id="currentpoints' + value + '" style="display: none;">0</div><div class="maxpoints" id="maxpoints' + value + '" style="display: none;">' + max_points + '</div>';
                    }

                    if(!(value >= 99100 && value <= 99160)) { // don't include dragon king skills in url
                        sd[value][URL_POS] = url_index;
                        url_index++;
                    } else {
                        sd[value][URL_POS] = -1
                    }

                    // get color of icon background
                    output += '<div id="skillback' + value + '" class="icon-back ';
                     if(sd[value][USAGE_TYPE] == 1) {
                        if(sd[value][DAMAGE_TYPE] == 1) {
                            output += "red";
                        } else if(sd[value][DAMAGE_TYPE] == 2) {
                            output += "blue";
                        } else if(sd[value][DAMAGE_TYPE] == 3) {
                            if(sd[value][SKILL_TYPE] == 0) {
                                output += "orange";
                            } else if(sd[value][SKILL_TYPE] == 1) {
                                output += "purple";
                            } else if(sd[value][SKILL_TYPE] == 2) {
                                output += "orange"
                            } else if(sd[value][SKILL_TYPE] == 3) {
                                output += "green";
                            } else if(sd[value][SKILL_TYPE] == 4) {
                                output += "orange";
                            } else if(sd[value][SKILL_TYPE] == 5) {
                                output += "green";
                            } else if(sd[value][SKILL_TYPE] == 6) {
                                output += "orange";
                            } else if(sd[value][SKILL_TYPE] == 7) {
                                output += "purple"
                            } else {
                                output += "orange";
                            }
                        } else {
                            output += "grey";
                        }
                    } else if(sd[value][USAGE_TYPE] == 2) {
                       output += "yellow";
                    } else {
                       output += "grey";
                    }
                    output += '"></div>';
                } else if(value == "right") {
                    output += '<div id="rightbeginarrow' + tree_class+ value_index + '" class="skill-arrow right-begin"></div><div id="righthookarrow' + tree_class+ value_index + '" class="skill-arrow right-hook"></div><div id="arrowtip' + tree_class+ value_index + '" class="skill-arrow tip"></div>';
                } else if(value == "down") {
                    output += '<div id="downarrow' + tree_class+ value_index + '" class="skill-arrow down"></div><div id="arrowtip' + tree_class+ value_index + '" class="skill-arrow tip"></div>';
                }
            }

            output += '</div></td>';

            if(column++ % width == 0) {
                row++;
                column = 1;
                output += "</tr><tr>";
            }
        }
    });

    output += "</tr>";
    document.getElementById(tree_container).innerHTML = output + "</table>";
}

function addTreeEvents(tree_class)
// adds events (like click and mouse over) to the tree skills
{
    tree_class = tree_class.toLowerCase();
    pos = -1;

    st[tree_class].forEach(function(value)
    {
        if(pos == -1) {
            pos = 0;
        } else if(!isNaN(Number(value)) && value != -1) {
            shell = document.getElementById("shell" + value);
            shell.onclick = function(p1, p2, p3, p4) { return function() { skillclick(p1, p2, p3, p4); }; }(value, pos, 1, tree_class);
            shell.oncontextmenu = function(p1, p2, p3, p4) { return function() { skillclick(p1, p2, p3, p4); }; }(value, pos, 0, tree_class);
            shell.onmouseover = function(p1) { return function() { showinfo(p1); }; }(value);
            shell.onmouseout = function() { hideinfo(); };
        }
        pos++;
    });
}

function buildTrees()
// builds all class trees based on definitions for base_class and master_class
{
    buildTree(base_class, "base-tree");
    addTreeEvents(base_class);
    buildTree(master_class, "mc-tree");
    addTreeEvents(master_class);
}

function glow(skill, pos, add, skill_class)
// adds glow to a skill and all arrows pointing to that skill
{
    var arrowpos = pos - st[skill_class][0] + 1;
    var modify = "glow" + skill;

    if(add == 1) {
        document.getElementById("shell" + skill).style.cursor = "pointer";
        document.getElementById(modify).className = "glow"

        if(arrowpos > 0) {
            if(st[skill_class][arrowpos] == "right") {
                document.getElementById("rightbeginarrow" + skill_class + arrowpos).className += " active";
                document.getElementById("righthookarrow" + skill_class + arrowpos).className += " active";
                document.getElementById("arrowtip" + skill_class + arrowpos).className += " active";
            } else if(st[skill_class][arrowpos] == "down") {
                document.getElementById("downarrow" + skill_class + arrowpos).className += " active";
                document.getElementById("arrowtip" + skill_class + arrowpos).className += " active";
            }
        }
    } else {
        document.getElementById("shell" + skill).style.cursor = "default";
        document.getElementById(modify).className = "";

        if(arrowpos > 0) {
            if(st[skill_class][arrowpos] == "right") {
                document.getElementById("rightbeginarrow" + skill_class + arrowpos).className = "skill-arrow right-begin";
                document.getElementById("righthookarrow" + skill_class + arrowpos).className = "skill-arrow right-hook";
                document.getElementById("arrowtip" + skill_class + arrowpos).className = "skill-arrow tip";
            } else if(st[skill_class][arrowpos] == "down") {
                document.getElementById("downarrow" + skill_class + arrowpos).className = "skill-arrow down";
                document.getElementById("arrowtip" + skill_class + arrowpos).className = "skill-arrow tip";
            }
        }
    }
}

function maxlevelcheck(skill,level)
{
    // originally there were skills in the game that went over the max level, this prevented you from learning them
    return 1;
}

function showinfo(skill)
{
    updateinfo(skill);

    show_info = 1;
    document.getElementById("infobox").style.display = "inline";
    info_height = document.getElementById("infobox").offsetHeight;
    info_width = document.getElementById("infobox").offsetWidth;
}

function convertTime(time)
// time in seconds, converts to hours/minutes/seconds string
{
    var hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    var minutes = Math.floor(time / 60);
    time = time - minutes * 60;
    var seconds = time;

    if(minutes < 10) {
        minutes = "0" + minutes;
    }
    if(seconds < 10) {
        seconds = "0" + seconds;
    }

    if(hours >= 1) {
        return hours + ":" + minutes + ":" + seconds;
    } else {
        return minutes + ":" + seconds;
    }
}

function updateinfo(skill)
{
    modify = "currentpoints" + skill;
    var currentpoints = parseInt(document.getElementById(modify).innerHTML);
    var current_skill = 0;

    if(currentpoints == 0 || currentpoints == 1) {
        current_skill = skill;
    } else {
        var next_skill = sd[skill][NEXT_ID];

        if(currentpoints > 2) {
            for(i_pos = 2; i_pos < currentpoints; i_pos++) {
                next_skill = sd[next_skill][NEXT_ID];
            }
        }
        current_skill = next_skill;
    }

    if(current_skill in tooltip) {
        skill_text = tooltip[current_skill];
    } else {
        skill_text = '<div class="title">' + gs["text_all_data"][7][sd[skill][NAME_ID]] + '</b></div>';

        effects_string = "";
        for(effect_num = 1; effect_num <= 2; effect_num++) {
            if(effect_num == 1) {
                effect = sd[current_skill][EFFECT_ID_1];
                effect_perc = sd[current_skill][EFFECT_PERC_1];
                effect_val = sd[current_skill][EFFECT_VAL_1];
            } else {
                effect = sd[current_skill][EFFECT_ID_2];
                effect_perc = sd[current_skill][EFFECT_PERC_2];
                effect_val = sd[current_skill][EFFECT_VAL_2];
            }

            if(effect != -1) {
                effect_string = gs["text_all_data"][8][effect];

                if((effect == 100 || effect == 101 || effect == 102 || effect == 103 || effect == 104) && sd[current_skill][USAGE_TYPE] != 2) {
                    if(sd[current_skill][DAMAGE_TYPE] == 1) {
                         effect_string = gs["DST_SYSTEMEFFECT_PHYSICAL"] + effect_string;
                    } else if(sd[current_skill][DAMAGE_TYPE] == 2) {
                        effect_string = gs["DST_SYSTEMEFFECT_ENERGY"] + effect_string;
                    } else if(sd[current_skill][DAMAGE_TYPE] == 3) {
                        effect_string = gs["DST_SYSTEMEFFECT_STATE"] + effect_string;
                    }
                }

                if(effect_perc) {
                    effect_string = effect_string.replace("%d", effect_val + "%");
                    effect_string = effect_string.replace("%g", convertTime(effect_val) + "%");
                    effect_string = effect_string.replace("$x", effect_val + "%");
                } else {
                    effect_string = effect_string.replace("%d", effect_val);
                    effect_string = effect_string.replace("%g", convertTime(effect_val));
                    effect_string = effect_string.replace("$x", effect_val);
                }
                effect_string = effect_string.replace("%%", "%");

                if(effect_num == 2) {
                    effects_string += "<br>";
                }
                effects_string += effect_string;
            }
        }

        if(effects_string != "") {
            skill_text += '<div class="effect">' + effects_string + '</div>';
        }

        skill_text += '<div class="other">';

        //console.log(sd[current_skill][TARGET] + " " + sd[current_skill][TARGET_AREA] + " " + sd[current_skill][AOE]);

        if(sd[current_skill][TARGET] in target_array) {
            if(sd[current_skill][TARGET_AREA] in target_array[sd[current_skill][TARGET]]) {
                if(sd[current_skill][AOE] in target_array[sd[current_skill][TARGET]][sd[current_skill][TARGET_AREA]]) {
                    if(target_array[sd[current_skill][TARGET]][sd[current_skill][TARGET_AREA]][sd[current_skill][AOE]] == 0) {
                        temp_text = "";
                    } else {
                        temp_text = gs["DST_SKILL_TARGET_AND_RANGE_INFO" + target_array[sd[current_skill][TARGET]][sd[current_skill][TARGET_AREA]][sd[current_skill][AOE]]] + "<br>";
                    }

                    if(sd[current_skill][AOE_RADIUS_1] != 0) {
                        temp_text = temp_text.replace("%d", sd[current_skill][AOE_RADIUS_1]);
                    }

                    if(sd[current_skill][AOE_RADIUS_2] != 0) {
                        temp_text = temp_text.replace("%d", sd[current_skill][AOE_RADIUS_2]);
                    }

                    if(sd[current_skill][MAX_TARGETS] != 1) {
                        temp_text = temp_text.replace("%d", sd[current_skill][MAX_TARGETS]);
                    }

                    skill_text += temp_text;
                } else {
                    skill_text += "Unknown Target<br>"
                }
            } else {
                skill_text += "Unknown Target<br>"
            }
        } else {
            skill_text += "Unknown Target<br>"
        }

        skill_text += gs["DST_SKILL_SP_INFO_AVATAR_LEVEL"] + sd[current_skill][LEVEL_REQ];

        if(sd[current_skill][EP_COST] != 0) {
            skill_text += "<br>" + gs["DST_SKILL_EP_CONSUMPTION"].replace("%5d", sd[current_skill][EP_COST]);
        }

        if(sd[current_skill][LP_COST] != 0) {
            skill_text += "<br>" + gs["DST_SKILL_LP_CONSUMPTION"].replace("%5d", sd[current_skill][LP_COST]);
        }

        if(sd[current_skill][CAST_TIME] != 0) {
            skill_text += "<br>" + gs["DST_SKILL_CASTTIME"].replace("%s", convertTime(sd[current_skill][CAST_TIME]));
        }

        if(sd[current_skill][COOLDOWN] != 0) {
            skill_text += "<br>" + gs["DST_SKILL_COOLTIME"].replace("%s", convertTime(sd[current_skill][COOLDOWN]));
        }

        if(sd[current_skill][DURATION] != 0) {
            skill_text += "<br>" + gs["DST_SKILL_DURATIONTIME"].replace("%s", convertTime(sd[current_skill][DURATION]));
        }

        if(sd[current_skill][RANGE] != 0) {
            skill_text += "<br>" + gs["DST_SKILL_USERANGE"].replace("%d", sd[current_skill][RANGE]);
        }

        skill_text += '</div>';

        rp_set = 0;

        for(rp_num = 1; rp_num <= 6; rp_num++)
        {
            var rp_val;
            switch(rp_num) {
                case 1: rp_val = sd[current_skill][RP_ID_1]; break
                case 2: rp_val = sd[current_skill][RP_ID_2]; break
                case 3: rp_val = sd[current_skill][RP_ID_3]; break
                case 4: rp_val = sd[current_skill][RP_ID_4]; break
                case 5: rp_val = sd[current_skill][RP_ID_5]; break
                case 6: rp_val = sd[current_skill][RP_ID_6]; break
            }

            if(rp_val != -1) {
                if(rp_set == 0) {
                    skill_text += '<div class="rp">';
                    rp_set = 1;
                }
                skill_text += '<div class="effect-' + rp_val + '"></div>';
            }
        }

        if(rp_set == 1) {
            skill_text += '</div>';
        }

        tooltip[current_skill] = skill_text;
    }

    document.getElementById("infoboxtext").innerHTML = skill_text;
}

function hideinfo()
{
    show_info = 0;
    document.getElementById("infobox").style.display = "none";

    var obj = document.getElementById("infobox").style;
    obj.left = 0 + 'px';
    obj.top = 0 + 'px';
}

function resetRequiredBy(skill, tree_class)
{
    var modify = "currentpoints" + skill;
    var resetlevel = parseInt(document.getElementById(modify).innerHTML);
    var skip_first = 1;

    if(resetlevel != 0) {
        st[tree_class].forEach(function(value)
        {
            if(skip_first == 1) {
                skip_first = 0;
            } else {
                if(!isNaN(Number(value)) && value != -1) {
                    if(sd[value][SKILL_REQ_1] == skill || sd[value][SKILL_REQ_3] == skill) {
                        resetRequiredBy(value, tree_class)
                    }
                }
            }
        });

        for(l = 0; l < resetlevel; l++) {
            skillclick(skill, 0, 0, tree_class);
        }
    }
}

function resetTree(tree_class)
{
    skip_first = 1;
    tree_class = tree_class.toLowerCase();

    st[tree_class].forEach(function(value)
    {
        if(skip_first == 1) {
            skip_first = 0;
        } else {
            if(!isNaN(Number(value)) && value != -1) {
                if(sd[value][SKILL_REQ_1] == -1 && sd[value][SKILL_REQ_3] == -1) {
                    resetRequiredBy(value, tree_class);
                }
            }
        }
    });
}

function reset(mode)
{
    disabletool = 1;
    refresh_url = 0;

    if(mode == 0 || mode == 1) {
        resetTree(base_class);
    }

    if(mode == 0 || mode == 2) {
        resetTree(master_class);
    }

    if(mode == 0) {
        url = "";
        while(url.length != url_index) {
            url = url + "0";
        }
    }

    disabletool = 0;
    refresh_url = 1;
    changeurls();
}

function skillclick(skill, pos ,add, skill_class)
{
    if(ready == 1) {

        modify = "maxpoints" + skill;
        var maxpoints = parseInt(document.getElementById(modify).innerHTML);
        modify = "currentpoints" + skill;
        var currentpoints = parseInt(document.getElementById(modify).innerHTML);

        if(add == 1)
        {
            var check1 = "glow" + skill;
            var check2 = document.getElementById(check1).className;
            if((check2 == "glow" || (currentpoints > 0) || (initv == 1)) && maxlevelcheck(skill,currentpoints+1))
            {
                if(currentpoints < maxpoints && current < (max - 1))
                {
                    if(initv == 0)
                    {
                        current++;
                        document.getElementById("remainingpoints").innerHTML = parseInt(document.getElementById("remainingpoints").innerHTML) + 1;
                        if(skill_class.toUpperCase() == base_class.toUpperCase()) { document.getElementById("classpoints").innerHTML = parseInt(document.getElementById("classpoints").innerHTML) + 1; }
                        else { document.getElementById("masterclasspoints").innerHTML = parseInt(document.getElementById("masterclasspoints").innerHTML) + 1; }
                        if(disablesave==0) updateurl(skill, 1);
                    }

                    currentpoints++;
                    document.getElementById(modify).innerHTML = currentpoints;

                    if(currentpoints == maxpoints) { document.getElementById("shell" + skill).style.cursor = "default"; }
                    else document.getElementById("shell" + skill).style.cursor = "pointer";

                    if(currentpoints == 1)
                    {
                        modify = "skillicon" + skill;
                        document.getElementById(modify).className += " active";
                        modify = "skillback" + skill;
                        document.getElementById(modify).className += " active";
                        modify = "currentpoints" + skill;
                        document.getElementById(modify).className += " active";
                        modify = "maxpoints" + skill;
                        document.getElementById(modify).className += " active";
                        modify = "glow" + skill;
                        document.getElementById(modify).className = "";

                        // glow all skills that this skill was a prereq for
                        var pos = -1;
                        st[skill_class].forEach(function(value)
                        {
                            if(pos == -1) {
                                pos = 0;
                            } else {
                                if(!isNaN(Number(value)) && value != -1) {
                                    if(sd[value][SKILL_REQ_1] == skill) {
                                        if(sd[value][SKILL_REQ_3] == -1) {
                                            glow(value, pos, 1, skill_class);
                                        } else {
                                            var modify_check = "currentpoints" + sd[value][SKILL_REQ_3];
                                            var req_points = parseInt(document.getElementById(modify_check).innerHTML);

                                            if(req_points > 0) {
                                                glow(value, pos, 1, skill_class);
                                            }
                                        }
                                    } else if(sd[value][SKILL_REQ_3] == skill) {
                                        if(sd[value][SKILL_REQ_1] == -1) {
                                            glow(value, pos, 1, skill_class);
                                        } else {
                                            var modify_check = "currentpoints" + sd[value][SKILL_REQ_1];
                                            var req_points = parseInt(document.getElementById(modify_check).innerHTML);

                                            if(req_points > 0) {
                                                glow(value, pos, 1, skill_class);
                                            }
                                        }
                                    }
                                }
                                pos++;
                            }
                        });
                    }

                    if(initv == 0)
                    {
                        updateinfo(skill);
                    }
                }
            }
        }
        else if(currentpoints > 0 && currentpoints <= maxpoints && !(sd[skill][SP_COST] == 0 && currentpoints == 1))
        {
            var fail = 0;
            var reqs = new Array();

            if(currentpoints == 1)
            {
                // check to see if there are any prereqs preventing the unlearning of this skill
                var pos = -1;
                st[skill_class].forEach(function(value)
                {
                    if(pos == -1) {
                        pos = 0;
                    } else {
                        if(!isNaN(Number(value)) && value != -1) {
                            if(sd[value][SKILL_REQ_1] == skill) {
                                var modify_check = "currentpoints" + value;
                                var req_points = parseInt(document.getElementById(modify_check).innerHTML);

                                if(req_points != 0) {
                                    fail = 1;
                                } else {
                                    reqs.push([value, pos]);
                                }
                            }

                            if(sd[value][SKILL_REQ_3] == skill) {
                                var modify_check = "currentpoints" + value;
                                var req_points = parseInt(document.getElementById(modify_check).innerHTML);

                                if(req_points != 0) {
                                    fail = 1;
                                } else {
                                    reqs.push([value, pos])
                                }
                            }
                        }
                        pos++;
                    }
                });

                if(fail == 0) {
                    reqs.forEach(function(value)
                    {
                        glow(value[0], value[1], 0, skill_class);
                    });

                    modify = "skillicon" + skill;
                    document.getElementById(modify).className = document.getElementById(modify).className.substring(0, document.getElementById(modify).className.length - 7);
                    modify = "skillback" + skill;
                    document.getElementById(modify).className = document.getElementById(modify).className.substring(0, document.getElementById(modify).className.length - 7);
                    modify = "currentpoints" + skill;
                    document.getElementById(modify).className = document.getElementById(modify).className.substring(0, document.getElementById(modify).className.length - 7);
                    modify = "maxpoints" + skill;
                    document.getElementById(modify).className = document.getElementById(modify).className.substring(0, document.getElementById(modify).className.length - 7);
                    modify = "glow" + skill;
                    document.getElementById(modify).className = "glow";
                }
            }

            if(fail == 0) {
                if(initv == 0)
                {
                    current--;
                    document.getElementById("remainingpoints").innerHTML = parseInt(document.getElementById("remainingpoints").innerHTML) - 1;
                    if(skill_class.toUpperCase() == base_class.toUpperCase()) { document.getElementById("classpoints").innerHTML = parseInt(document.getElementById("classpoints").innerHTML) - 1; }
                    else { document.getElementById("masterclasspoints").innerHTML = parseInt(document.getElementById("masterclasspoints").innerHTML) - 1; }
                    if(disablesave==0) updateurl(skill, 0);
                }

                currentpoints--;
                modify = "currentpoints" + skill;
                document.getElementById(modify).innerHTML = currentpoints;
                if(currentpoints != maxpoints) { document.getElementById("shell" + skill).style.cursor = "pointer"; }

                if(initv == 0)
                {
                    updateinfo(skill);
                }
            }
        }
    }
}

function learnFreebie(freebie_class)
// activates all freebie skills that cost no SP
{
    pos = -1;
    freebie_class = freebie_class.toLowerCase();

    st[freebie_class].forEach(function(value)
    {
        if(pos == -1) { // skip first entry of array, which contains tree width
            pos = 0;
        } else {
            if(!isNaN(Number(value)) && value != -1) {
                if(sd[value][SP_COST] == 0 || sd[value][SKILL_REQ_1] == -1) {
                    if(sd[value][SP_COST] == 0) {
                        glow(value, pos, 1, freebie_class);
                        skillclick(value, pos, 1, freebie_class);
                    } else {
                        glow(value, pos, 1, freebie_class);
                    }
                }
            }
            pos++;
        }
    });
}

function learnFreebies()
// learns all freebies for base_class and master_class
{
    ready = 1;
    learnFreebie(base_class);
    learnFreebie(master_class);
}

function mouseX(evt) {if (!evt) evt = window.event; if (evt.pageX) return evt.pageX; else if (evt.clientX)return evt.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft); else return 0;}
function mouseY(evt) {if (!evt) evt = window.event; if (evt.pageY) return evt.pageY; else if (evt.clientY)return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop); else return 0;}

function moveinfo(evt)
{
    if(true)
    {
        mouse_left = parseInt(mouseX(evt));
        mouse_top = parseInt(mouseY(evt));
        xOffset = 32;
        yOffset = 16;

        if(mouse_top + info_height > document.body.scrollTop + document.body.offsetHeight)
        {
            mouse_top -= (mouse_top + info_height) - (document.body.scrollTop + document.body.offsetHeight);
        }

        if(mouse_left + info_width + (xOffset * 2) > document.body.scrollLeft + document.body.offsetWidth)
        {
            mouse_left -= info_width + (xOffset * 2);
        }

        var obj = document.getElementById("infobox").style;
        obj.left = (mouse_left + xOffset) + 'px';
        obj.top = (mouse_top - yOffset) + 'px';
    }
}

function changeurls()
{
    var newurl = "";
    var allZero = 1;
    var curloc = document.URL;

    for(check_zero = 0; check_zero < url.length; check_zero++) {
        if(url.charAt(check_zero) != 0) {
            allZero = 0;
            break;
        }
    }

    if(!allZero) {
        if(is_local) {
            //urloutput = "/tools/skill-calculator/class=" + class_name + "/" + url + "/";
            urloutput = "class=" + class_name + "&build=" + url;
        } else {
            urloutput = site_url + "#" + class_name + "-" + url;
        }
    } else {
        if(is_local) {
            //urloutput = "/tools/skill-calculator/class=" + class_name + "/";
            urloutput = "class=" + class_name;
        } else {
            urloutput = "";
        }
    }

    historyoutput = urloutput;

    if(is_local == 1) {
        if(lang != "eng") {
            //historyoutput = urloutput + lang + "/";
            historyoutput = urloutput + "&lang=" + lang;
        }
    }

    if(refresh_url == 1 && top.history.replaceState) {
        top.history.replaceState({ state: "bar" }, document.title, site_url + "?tool=Skill-Calculator&" + historyoutput);
    }

    if(is_local) {
        document.getElementById("engurl").href = frame_url + "?" + urloutput;
        document.getElementById("fraurl").href = frame_url + "?" + urloutput + "&lang=fra";
        document.getElementById("porurl").href = frame_url + "?" + urloutput + "&lang=por";
        document.getElementById("spnurl").href = frame_url + "?" + urloutput + "&lang=spn";
        document.getElementById("polurl").href = frame_url + "?" + urloutput + "&lang=pol";
        document.getElementById("korurl").href = frame_url + "?" + urloutput + "&lang=kor";
        document.getElementById("twurl").href = frame_url + "?" + urloutput + "&lang=tw";
        document.getElementById("hkurl").href = frame_url + "?" + urloutput + "&lang=hk";

        document.getElementById("calcurl").href = site_url + "?tool=Skill-Calculator&" + historyoutput;
        document.getElementById("calcurl2").href = site_url + "?tool=Skill-Calculator&" + historyoutput;
    } else {
        document.getElementById("calcurl").href = urloutput;
        document.getElementById("calcurl2").href = urloutput;
    }
}

function updateurl(skill, add)
{
    var allZero = 1;
    var urlpos = parseInt(url.charAt(sd[skill][URL_POS]));

    if(add == 1) {
        urlpos++;
    } else {
        urlpos--;
    }

    url = url.substring(0,sd[skill][URL_POS]) + urlpos + url.substring(sd[skill][URL_POS]+1,url.length+1);
    changeurls();
}

function initBacktrack(skill, bt_class)
{
    if(sd[skill][URL_POS] != -1) {
        bt_importlevel = url.charAt(sd[skill][URL_POS]);

        if(bt_importlevel != 0) {
            if(sd[skill][SKILL_REQ_1] != -1 && !(sd[skill][SKILL_REQ_1] in complete)) {
                initBacktrack(sd[skill][SKILL_REQ_1], bt_class);
            }

            if(sd[skill][SKILL_REQ_3] != -1 && !(sd[skill][SKILL_REQ_3] in complete)) {
                initBacktrack(sd[skill][SKILL_REQ_3], bt_class);
            }

            for(l = 0; l < bt_importlevel; l++) {
                skillclick(skill, pos, 1, bt_class);
            }
        }
    }

    complete[skill] = 1;
}

function initurl()
{
    site_url = top.location.href.split('?')[0];
    frame_url = window.location.href.split('?')[0];

    if(is_local == 0) {
        site_url = window.location + "";
        hash_pos = site_url.indexOf("#");

        if(hash_pos != -1) {
            url = site_url.substr(site_url.lastIndexOf("-") + 1, site_url.length - site_url.lastIndexOf("-") - 1);
            site_url = site_url.substr(0, hash_pos);
        }
    }


    if(url == "" || url.length != url_index)
    {
        while(url.length != url_index) {
            url = url + "0";
        }
    }
    else
    {
        pos = -1;

        base_class = base_class.toLocaleLowerCase();
        st[base_class].forEach(function(value) {
            if(pos == -1) { // skip first entry of array, which contains tree width
                pos = 0;
            } else {
                if(!isNaN(Number(value)) && value != -1) {
                    if(sd[value][URL_POS] != -1 && !(value in complete)) {
                        importlevel = url.charAt(sd[value][URL_POS]);

                        if(importlevel != 0) {
                            disabletool = 1;

                            if(sd[value][SKILL_REQ_1] != -1 && !(sd[value][SKILL_REQ_1] in complete)) {
                                initBacktrack(sd[value][SKILL_REQ_1], base_class);
                            }

                            if(sd[value][SKILL_REQ_3] != -1 && !(sd[value][SKILL_REQ_3] in complete)) {
                                initBacktrack(sd[value][SKILL_REQ_3], base_class);
                            }

                            for(l = 0; l < importlevel; l++) {
                                skillclick(value, pos, 1, base_class);
                            }
                            disabletool = 0;
                        }
                        complete[value] = 1;
                    }
                    pos++;
                }
            }
        });

        prev_pos = pos;
        pos = -1;

        master_class = master_class.toLocaleLowerCase();
        st[master_class].forEach(function(value) {
            if(pos == -1) { // skip first entry of array, which contains tree width
                pos = 0;
            } else {
                if(!isNaN(Number(value)) && value != -1) {
                    if(sd[value][URL_POS] != -1 && !(value in complete)) {
                        importlevel = url.charAt(sd[value][URL_POS]);

                        if(importlevel != 0) {
                            disabletool = 1;

                            if(sd[value][SKILL_REQ_1] != -1 && !(sd[value][SKILL_REQ_1] in complete)) {
                                initBacktrack(sd[value][SKILL_REQ_1], master_class);
                            }

                            if(sd[value][SKILL_REQ_3] != -1 && !(sd[value][SKILL_REQ_3] in complete)) {
                                initBacktrack(sd[value][SKILL_REQ_3], master_class);
                            }

                            for(l = 0; l < importlevel; l++) {
                                skillclick(value, pos, 1, master_class);
                            }
                            disabletool = 0;
                        }
                        complete[value] = 1;
                    }
                    pos++;
                }
            }
        });
    }

    refresh_url = 0;
    changeurls();
    refresh_url = 1;
}

function init()
// startup
{
    switch(master_class){
        case 11: master_class = "HSF";
        case "HSF": class_name = "Fighter"; base_class = "HFI"; break;
        case 17: master_class ="HSM";
        case "HSM": class_name = "Swordsman"; base_class = "HFI"; break;
        case 12: master_class = "HCR";
        case "HCR": class_name = "Crane-Hermit"; base_class = "HMY"; break;
        case 18: master_class = "HTR";
        case "HTR": class_name = "Turtle-Hermit"; base_class = "HMY"; break;
        case 13: master_class = "NDW";
        case "NDW": class_name = "Dark-Warrior"; base_class = "NFI"; break;
        case 19: master_class = "NSK";
        case "NSK": class_name = "Shadow-Knight"; base_class = "NFI"; break;
        case 14: master_class = "NDH";
        case "NDH": class_name = "Dende-Priest"; base_class = "NMY"; break;
        case 20: master_class = "NPS";
        case "NPS": class_name = "Poko-Priest"; base_class = "NMY"; break;
        case 15: master_class = "MUL";
        case "MUL": class_name = "Ultimate-Majin"; base_class = "MMI"; break;
        case 21: master_class = "MGR";
        case "MGR": class_name = "Grand-Chef-Majin"; base_class = "MMI"; break;
        case 16: master_class = "MPL";
        case "MPL": class_name = "Plasma-Majin"; base_class = "MWO"; break;
        case 22: master_class = "MKR";
        case "MKR": class_name = "Karma-Majin"; base_class = "MWO"; break;
    }

    infobox_html = document.createElement('div');
    infobox_html.innerHTML = '<div id="infobox" class="skill-infobox"><table class="infobox"><tr><td id="infoboxtext"></td></tr></table></div>';
    document.body.appendChild(infobox_html.firstChild);
    document.onmousemove = moveinfo;
    curloc = document.URL;
    //if(curloc.indexOf("dbocom.com") == -1) { is_local = 0; }

    buildTrees();
    learnFreebies();
    initv = 0;
    initurl();
    changeurls();
    disablesave = 0;
}