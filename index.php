<?php

class SkillCalculator
{
    private $_game_max_level = 70;
    private $_default_lang = "eng";
    private $_default_class = "Fighter";

    private $_valid_langs = array(
        "eng" => "English",
        "kor" => "&#54620;&#44397;&#50612;",
        "tw" => "&#20013;&#25991;",
        "hk" => "&#20013;&#25991;",
        "fra" => "Fran&ccedil;ais",
        "pol" => "Polski",
        "por" => "Portugu&ecirc;s",
        "spn" => "Espa&ntilde;ol"
    );
    private $_valid_classes = array(

        "Martial-Artist" => array(
            "display_name" => "Martial Artist",
            "class_id" => 1,
            "basic_class" => null,
            "master_classes" => array("Fighter", "Swordsman")
        ),

        "Spiritualist" => array(
            "display_name" => "Spiritualist",
            "class_id" => 2,
            "basic_class" => null,
            "master_classes" => array("Crane-Hermit", "Turtle-Hermit")
        ),

        "Warrior" => array(
            "display_name" => "Warrior",
            "class_id" => 3,
            "basic_class" => null,
            "master_classes" => array("Dark-Warrior", "Shadow-Knight")
        ),

        "Dragon-Clan" => array(
            "display_name" => "Dragon Clan",
            "class_id" => 4,
            "basic_class" => null,
            "master_classes" => array("Dende-Priest", "Poko-Priest")
        ),

        "Mighty-Majin" => array(
            "display_name" => "Mighty Majin",
            "class_id" => 5,
            "basic_class" => null,
            "master_classes" => array("Ultimate-Majin", "Grand-Chef-Majin")
        ),

        "Wonder-Majin" => array(
            "display_name" => "Wonder Majin",
            "class_id" => 6,
            "basic_class" => null,
            "master_classes" => array("Plasma-Majin", "Karma-Majin")
        ),

        "Fighter" => array(
            "display_name" => "Fighter",
            "class_id" => 11,
            "basic_class" => "Martial-Artist"
        ),

        "Crane-Hermit" => array(
            "display_name" => "Crane Hermit",
            "class_id" => 12,
            "basic_class" => "Spiritualist"
        ),

        "Dark-Warrior" => array(
            "display_name" => "Dark Warrior",
            "class_id" => 13,
            "basic_class" => "Warrior"
        ),

        "Dende-Priest" => array(
            "display_name" => "Dende Priest",
            "class_id" => 14,
            "basic_class" => "Dragon-Clan"
        ),

        "Ultimate-Majin" => array(
            "display_name" => "Ultimate Majin",
            "class_id" => 15,
            "basic_class" => "Mighty-Majin"
        ),

        "Plasma-Majin" => array(
            "display_name" => "Plasma Majin",
            "class_id" => 16,
            "basic_class" => "Wonder-Majin"
        ),

        "Swordsman" => array(
            "display_name" => "Swordsman",
            "class_id" => 17,
            "basic_class" => "Martial-Artist"
        ),

        "Turtle-Hermit" => array(
            "display_name" => "Turtle Hermit",
            "class_id" => 18,
            "basic_class" => "Spiritualist"
        ),

        "Shadow-Knight" => array(
            "display_name" => "Shadow Knight",
            "class_id" => 19,
            "basic_class" => "Warrior"
        ),

        "Poko-Priest" => array(
            "display_name" => "Poko Priest",
            "class_id" => 20,
            "basic_class" => "Dragon-Clan"
        ),

        "Grand-Chef-Majin" => array(
            "display_name" => "Grand Chef Majin",
            "class_id" => 21,
            "basic_class" => "Mighty-Majin"
        ),

        "Karma-Majin" => array(
            "display_name" => "Karma Majin",
            "class_id" => 22,
            "basic_class" => "Wonder-Majin"
        )
    );

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @return string
     */
    private function _sanitizeLang()
    {
        if(isset($_GET["lang"])) {
            $lang = $_GET["lang"];

            if(isset($this->_valid_langs[$lang])) {
                return $lang;
            }
        }

        return $this->_default_lang;
    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @return mixed
     */
    private function _sanitizeClass()
    {
        if(isset($_GET["class"])) {
            $class = $_GET["class"];

            if(isset($this->_valid_classes[$class])
                && isset($this->_valid_classes[$class]["basic_class"]) // also prevent user from picking basic classes
            ) {
                return $class;
            }
        }

        return $this->_default_class;
    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * @return int
     */
    private function _sanitizeBuild()
    {
        if(isset($_GET["build"])) {
            $build = $_GET["build"];

            if(is_numeric($build)) {
                return $build;
            }
        }

        return 0;
    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     *
     */
    public function buildPage()
    {
        $class = $this->_sanitizeClass();
        $classes = $this->_valid_classes;
        $build = $this->_sanitizeBuild();
        $lang = $this->_sanitizeLang();
        $langs = $this->_valid_langs;
        $skill_point_count = $this->_game_max_level - 1;
        $base_url = strtok($_SERVER["REQUEST_URI"],'?');

        REQUIRE "view/_template/header.php";
        REQUIRE "view/home/index.php";
        REQUIRE "view/_template/footer.php";
    }
}

$tool = new SkillCalculator();
$tool->buildPage();