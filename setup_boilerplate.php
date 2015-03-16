<?php
require_once('vendor/autoload.php');

function validate_project_name($project_name)
{
    if(!is_string($project_name)) {
        return false;
    }
    if(!$project_name) {
        return false;
    }
    return !!preg_match('/^[a-z]+$/', $project_name);
}

$climate = new League\CLImate\CLImate;


$climate->description('Boilerplate setup: Rename the boilerplate files and classes');
$climate->arguments->add([
    'project_name' => [
        'longPrefix'   => 'name',
        'description'  => 'Project (module) name',
        'defaultValue' => ''
    ],
    'help' => [
        'longPrefix'   => 'help',
        'description'  => 'Prints a usage statement',
        'noValue'      => true
    ],
    'quiet' => [
        'prefix'       => 'q',
        'longPrefix'   => 'quit',
        'description'  => 'Disable Output additional information on operations',
        'noValue'      => false
    ]
]);

if($climate->arguments->defined('help')) {
    $climate->usage();
    die();
}

$climate->underline()->out('Charcoal Boilerplate Module Setup');

$climate->arguments->parse();
$project_name = $climate->arguments->get('project_name');
$verbose = !!$climate->arguments->get('quiet');
$verbose = true;

if(!$project_name) {
    $input = $climate->input('What is the name of the project?');
    $project_name = strtolower($input->prompt());
}
if(!validate_project_name($project_name)) {
    $climate->red()->out('Invalid project name. Operation aborted.');
    die();
}

$climate->bold()->out(sprintf('Using "%s" as project name...', $project_name));



if(!function_exists('glob_recursive')) {
    function glob_recursive($pattern, $flags = 0)
    {
        $files = glob($pattern, $flags);
        foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
            $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
        }
        return $files;
    }
}

$climate->out("\n".'Replacing file content...');
foreach(glob_recursive("www/*") as $filename) {
    if(!is_dir($filename)) {
        $file = file_get_contents($filename);
        $num_replacement1 = 0;
        $num_replacement2 = 0;
        $content = preg_replace("/boilerplate/", $project_name, $file, -1, $num_replacement1);
        $content = preg_replace("/Boilerplate/", ucfirst($project_name), $content, -1, $num_replacement2);
        $num_replacements = ($num_replacement1+$num_replacement2);
        if($num_replacements > 0) {
            file_put_contents($filename, $content);
            if($verbose) {
                $climate->dim()->out(sprintf('%d occurence(s) of "boilerplate" has been changed to "%s" in file "%s"', $num_replacements, $project_name, $filename));
            }
        }
    }
}

$climate->out("\n".'Renaming files and directories');
$boilerplate_files = glob_recursive("www/*boilerplate*");
$boilerplate_files = array_reverse($boilerplate_files);
foreach($boilerplate_files as $filename) {
    $target_name = preg_replace("/boilerplate/", $project_name, basename($filename));
    $target_name = dirname($filename).'/'.$target_name;
    if($target_name != $filename) {
        rename($filename, $target_name);
        if($verbose) {
            $climate->dim()->out(sprintf('%s has been renamed to %s', $filename, $target_name));
        }
    }

}
$boilerplate_files = glob_recursive("www/*Boilerplate*");
$boilerplate_files = array_reverse($boilerplate_files);
foreach($boilerplate_files as $filename) {
    $climate->inline('.');
    $target_name = preg_replace("/Boilerplate/", ucfirst($project_name), basename($filename));
    $target_name = dirname($filename).'/'.$target_name;
    if($target_name != $filename) {
        rename($filename, $target_name);
        if($verbose) {
            $climate->dim()->out(sprintf('%s has been renamed to %s', $filename, $target_name));
        }
    }
}

$climate->green()->out("\n".'Success!');