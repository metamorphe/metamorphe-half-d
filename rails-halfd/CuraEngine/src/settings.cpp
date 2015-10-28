#include <cctype>
#include <fstream>
#include <stdio.h>
#include "utils/logoutput.h"
#include "utils/string.h"

#include "settings.h"

#define LTRIM_STRING(s) do { while(((s).length() > 0) && isspace((s)[0])) { (s).erase(0, 1); } } while(0)
#define RTRIM_STRING(s) do { while(((s).length() > 0) && isspace((s)[(s).length() - 1])) { (s).erase((s).length() - 1); } } while(0)
#define TRIM_STRING(s) do { LTRIM_STRING(s); RTRIM_STRING(s); } while(0)
#define STRINGIFY(_s) #_s
#define SETTING(name, default) do { _index.push_back(_ConfigSettingIndex(STRINGIFY(name), &name)); name = (default); } while(0)
#define SETTING2(name, altname, default) do { _index.push_back(_ConfigSettingIndex(STRINGIFY(name), &name)); _index.push_back(_ConfigSettingIndex(STRINGIFY(altname), &name)); name = (default); } while(0)

ConfigSettings *ConfigSettings::config = NULL;

ConfigSettings::ConfigSettings()
{
    config = this;
    SETTING(layerThickness, 100);
    SETTING(initialLayerThickness, 300);
    SETTING(filamentDiameter, 2890);
    SETTING(filamentFlow, 100);
    SETTING(layer0extrusionWidth, 600);
    SETTING(extrusionWidth, 400);
    SETTING(insetCount, 2);
    SETTING(downSkinCount, 6);
    SETTING(upSkinCount, 6);
    SETTING(skirtDistance, 6000);
    SETTING(skirtLineCount, 1);
    SETTING(skirtMinLength, 0);

    SETTING(initialSpeedupLayers, 4);
    SETTING(initialLayerSpeed, 20);
    SETTING(printSpeed, 50);
    SETTING(inset0Speed, 50);
    SETTING(insetXSpeed, 50);
    SETTING(moveSpeed, 150);
    SETTING(fanFullOnLayerNr, 2);

    SETTING(sparseInfillLineDistance, 100 * extrusionWidth / 20);
    SETTING(infillOverlap, 15);
    SETTING(infillSpeed, 50);
    SETTING(infillPattern, INFILL_AUTOMATIC);
    SETTING(skinSpeed, 50);

    SETTING(supportType, SUPPORT_TYPE_GRID);
    SETTING(supportAngle, -1);
    SETTING(supportEverywhere, 0);
    SETTING(supportLineDistance, sparseInfillLineDistance);
    SETTING(supportXYDistance, 700);
    SETTING(supportZDistance, 150);
    SETTING(supportExtruder, -1);

    SETTING(retractionAmount, 4500);
    SETTING(retractionAmountPrime, 0);
    SETTING(retractionSpeed, 45);
    SETTING(retractionAmountExtruderSwitch, 14500);
    SETTING(retractionMinimalDistance, 1500);
    SETTING(minimalExtrusionBeforeRetraction, 100);
    SETTING(retractionZHop, 0);

    SETTING(enableCombing, COMBING_ALL);
    SETTING(enableOozeShield, 0);
    SETTING(wipeTowerSize, 0);
    SETTING(multiVolumeOverlap, 0);
    SETTING2(objectPosition.X, posx, 102500);
    SETTING2(objectPosition.Y, posy, 102500);
    SETTING(objectSink, 0);
    SETTING(autoCenter, 1);

    SETTING(raftMargin, 5000);
    SETTING(raftLineSpacing, 1000);
    SETTING(raftBaseThickness, 0);
    SETTING(raftBaseLinewidth, 0);
    SETTING(raftInterfaceThickness, 0);
    SETTING(raftInterfaceLinewidth, 0);
    SETTING(raftInterfaceLineSpacing, 0);
    SETTING(raftAirGap, 0);
    SETTING(raftAirGapLayer0, 0);
    SETTING(raftBaseSpeed, 0);
    SETTING(raftFanSpeed, 0);
    SETTING(raftSurfaceThickness, 0);
    SETTING(raftSurfaceLinewidth, 0);
    SETTING(raftSurfaceLineSpacing, 0);
    SETTING(raftSurfaceLayers, 0);
    SETTING(raftSurfaceSpeed, 0);

    SETTING(minimalLayerTime, 5);
    SETTING(minimalFeedrate, 10);
    SETTING(coolHeadLift, 0);
    SETTING(fanSpeedMin, 100);
    SETTING(fanSpeedMax, 100);

    SETTING(fixHorrible, 0);
    SETTING(spiralizeMode, 0);
    SETTING(simpleMode, 0);
    SETTING(gcodeFlavor, GCODE_FLAVOR_REPRAP);

    memset(extruderOffset, 0, sizeof(extruderOffset));
    SETTING(extruderOffset[0].X, 0); // No one says that extruder 0 can not have an offset!
    SETTING(extruderOffset[0].Y, 0);
    SETTING(extruderOffset[1].X, 0);
    SETTING(extruderOffset[1].Y, 0);
    SETTING(extruderOffset[2].X, 0);
    SETTING(extruderOffset[2].Y, 0);
    SETTING(extruderOffset[3].X, 0);
    SETTING(extruderOffset[3].Y, 0);
    SETTING(extruderOffset[4].X, 0);
    SETTING(extruderOffset[4].Y, 0);
    SETTING(extruderOffset[5].X, 0);
    SETTING(extruderOffset[5].Y, 0);
    SETTING(extruderOffset[6].X, 0);
    SETTING(extruderOffset[6].Y, 0);
    SETTING(extruderOffset[7].X, 0);
    SETTING(extruderOffset[7].Y, 0);
    SETTING(extruderOffset[8].X, 0);
    SETTING(extruderOffset[8].Y, 0);
    SETTING(extruderOffset[9].X, 0);
    SETTING(extruderOffset[9].Y, 0);
    SETTING(extruderOffset[10].X, 0);
    SETTING(extruderOffset[10].Y, 0);
    SETTING(extruderOffset[11].X, 0);
    SETTING(extruderOffset[11].Y, 0);
    SETTING(extruderOffset[12].X, 0);
    SETTING(extruderOffset[12].Y, 0);
    SETTING(extruderOffset[13].X, 0);
    SETTING(extruderOffset[13].Y, 0);
    SETTING(extruderOffset[14].X, 0);
    SETTING(extruderOffset[14].Y, 0);
    SETTING(extruderOffset[15].X, 0);
    SETTING(extruderOffset[15].Y, 0);
    

    // TYPEA extended list
    SETTING(perimeterBeforeInfill, 0);

    // //Ultimaker
    // startCode =
    //     "M109 S210     ;Heatup to 210C\n"
    //     "G21           ;metric values\n"
    //     "G90           ;absolute positioning\n"
    //     "G28           ;Home\n"
    //     "G1 Z15.0 F300 ;move the platform down 15mm\n"
    //     "G92 E0        ;zero the extruded length\n"
    //     "G1 F200 E5    ;extrude 5mm of feed stock\n"
    //     "G92 E0        ;zero the extruded length again\n";

    // TypeA
    // ------
    // travelspeed = 12000
    // startup temp = 220

    startCode = ";-- START GCODE --\n"
    ";Sliced for Type A Machines Series 1\n"
    ";Sliced at: {day} {date} {time}\n"
    ";Basic settings: Layer height: {layer_height} Walls: {wall_thickness} Fill: {fill_density}\n"
    ";Print Speed: {print_speed} Support: {support}\n"
    ";Retraction Speed: {retraction_speed} Retraction Distance: {retraction_amount}\n"
    ";Print time: {print_time}\n"
    ";Filament used: {filament_amount}m {filament_weight}g\n"
    ";Filament cost: {filament_cost}\n"
    "M106 S255    ;start with the fan on\n"
    "G21        ;metric values\n"
    "G90        ;absolute positioning\n"
    "M106 S255    ;start with the fan on\n"
    "G28     ;move to endstops\n"
    "G29     ;allows for auto-levelling\n"
    "G1 X150 Y5  Z15.0 F12000 ;center and move the platform down 15mm\n"
    "M109 S230 ;Heat To temp\n"
    "G92 E0                  ;zero the extruded length\n"
    "G1 F200 E30              ;extrude 30mm of feed stock\n"
    "G92 E0                  ;zero the extruded length again\n"
    "G1 X175 Y25  Z0 F12000 ;remove bugger\n"
    "G1 X220 F12000 ;remove bugger\n"
    "G1 X150 Y150  Z15 F12000 ;recenter and begin\n"
    "G1 F12000\n";

    endCode = ";-- END GCODE --\n"
    "M104 S0     ;extruder heater off\n"
    "M140 S0     ;heated bed heater off (if you have it)\n"
    "G91         ;relative positioning\n"
    "G1 E-1 F300   ;retract the filament a bit before lifting the nozzle, to release some of the pressure\n"
    "G1 Z+0.5 E-5 X-20 Y-20 F12000 ;move Z up a bit and retract filament even more\n"
    "G28 X0 Y0     ;move X/Y to min endstops, so the head is out of the way\n"
    "M84           ;steppers off\n"
    "G90           ;absolute positioning\n"
    ";CURA_PROFILE_STRING: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\n"
    ";CURA_PROFILE_STRING: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\n";



    // startCode = 
    //     ";-- START GCODE --\n"
    //     ";Sliced for Type A Machines Series 1\n"
    //     "M106 S255    ;start with the fan on\n"
    //     "G21        ;metric values\n"
    //     "G90        ;absolute positioning\n"
    //     "M106 S255    ;start with the fan on\n"
    //     "G28     ;move to endstops\n"
    //     "G29     ;allows for auto-levelling\n"
    //     "G1 X150 Y5  Z15.0 F12000 ;center and move the platform down 15mm\n"
    //     "M109 S220 ;Heat To temp\n"
    //     "G92 E0                  ;zero the extruded length\n"
    //     "G1 F200 E30              ;extrude 30mm of feed stock\n"
    //     "G92 E0                  ;zero the extruded length again\n"
    //     "G1 X175 Y25  Z0 F12000 ;remove bugger\n"
    //     "G1 X220 F12000 ;remove bugger\n"
    //     "G1 X150 Y150  Z15 F12000 ;recenter and begin\n"
    //     "G1 F12000\n";



    // endCode =
    //     "M104 S0                     ;extruder heater off\n"
    //     "M140 S0                     ;heated bed heater off (if you have it)\n"
    //     "G91                            ;relative positioning\n"
    //     "G1 E-1 F300                    ;retract the filament a bit before lifting the nozzle, to release some of the pressure\n"
    //     "G1 Z+0.5 E-5 X-20 Y-20 F9000   ;move Z up a bit and retract filament even more\n"
    //     "G28 X0 Y0                      ;move X/Y to min endstops, so the head is out of the way\n"
    //     "M84                         ;steppers off\n"
    //     "G90                         ;absolute positioning\n";
        // travel_speed = 9000

        // endCode =
        //     ";-- END GCODE --\n"
        //     "M104 S0     ;extruder heater off\n"
        //     "M140 S0     ;heated bed heater off (if you have it)\n"
        //     "G91         ;relative positioning\n"
        //     "G1 E-1 F300   ;retract the filament a bit before lifting the nozzle, to release some of the pressure\n"
        //     "G1 Z+0.5 E-5 X-20 Y-20 F12000 ;move Z up a bit and retract filament even more\n"
        //     "G28 X0 Y0     ;move X/Y to min endstops, so the head is out of the way\n"
        //     "M84           ;steppers off\n"
        //     "G90           ;absolute positioning\n";
            

}

#undef STRINGIFY
#undef SETTING

bool ConfigSettings::setSetting(const char* key, const char* value)
{
    cura::log("Setting %s to %s\n", key, value);
    for(unsigned int n=0; n < _index.size(); n++)
    {
        if (stringcasecompare(key, _index[n].key) == 0)
        {
            *_index[n].ptr = atoi(value);
            return true;
        }
    }
    if (stringcasecompare(key, "startCode") == 0)
    {
        this->startCode = value;
        return true;
    }
    if (stringcasecompare(key, "endCode") == 0)
    {
        this->endCode = value;
        return true;
    }
    if (stringcasecompare(key, "preSwitchExtruderCode") == 0)
    {
        this->preSwitchExtruderCode = value;
        return true;
    }
    if (stringcasecompare(key, "postSwitchExtruderCode") == 0)
    {
        this->postSwitchExtruderCode = value;
        return true;
    }
    return false;
}

bool ConfigSettings::readSettings(void) {
    cura::log("Reading settings...\n");
    return readSettings(DEFAULT_CONFIG_PATH);
}

bool ConfigSettings::readSettings(const char* path) {
    printf("Reading settings... %s\n", path);
    std::ifstream config(path);
    std::string line;
    size_t line_number = 0;

    if(!config.good()) return false;

    while(config.good()) {
        bool multilineContent = false;
        size_t pos = std::string::npos;
        std::getline(config, line);
        line_number += 1;

        // De-comment and trim, skipping anything that shows up empty
        pos = line.find_first_of('#');
        if(pos != std::string::npos) line.erase(pos);
        TRIM_STRING(line);
        if(line.length() == 0) continue;

        // Split into key = val
        std::string key(""), val("");
        // cura::logError("Reading config file Line %zd: %s \n", line_number, line.c_str());
        pos = line.find_first_of('=');
        if(pos != std::string::npos && line.length() > (pos + 1)) {
            key = line.substr(0, pos);
            val = line.substr(pos + 1);
            TRIM_STRING(key);
            TRIM_STRING(val);
        }

        // Are we about to read a multiline string?
        if(val == CONFIG_MULTILINE_SEPARATOR) {
            val = "";
            multilineContent = true;
            bool done_multiline = false;

            while(config.good() && !done_multiline) {
                std::getline(config, line);
                line_number += 1;

                // We RTRIM the line for two reasons:
                //
                // 1) Make sure that a direct == comparison with '"""' works without
                //    worrying about trailing space.
                // 2) Nobody likes trailing whitespace anyway
                RTRIM_STRING(line);

                // Either accumuliate or terminate
                if(line == CONFIG_MULTILINE_SEPARATOR) {
                    done_multiline = true;
                    // Make sure we don't add an extra trailing newline
                    // to the parsed value
                    RTRIM_STRING(val);
                }
                else {
                    line += "\n";
                    val += line;
                }
            }

            // If we drop out but didn't finish reading, something failed
            if(!done_multiline) {
                cura::logError("Config(%s):L%zd: Failed while reading multiline string.\n", path, line_number);
                return false;
            }

        }

        // Fail if we don't get a key and val
        if(key.length() == 0 || (val.length() == 0 && !multilineContent)) {
            cura::logError("Config(%s): Line %zd: No key value pair found\n", path, line_number);
            return false;
        }

        // Set a config setting for the current K=V
        if(!setSetting(key.c_str(), val.c_str())) {
            cura::logError("Config(%s):L%zd: Failed to set '%s' to '%s'\n", path, line_number, key.c_str(), val.c_str());
            // cura::logError("No bueno");
            return false;
        }
    }

    return true;
}
