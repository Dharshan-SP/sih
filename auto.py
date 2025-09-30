#!/usr/bin/env python3
"""
predefined_nmap_by_intensity_with_basic_tools.py

Interactive runner that:
- prompts for a hostname/IP
- shows 3 intensity categories (Low, Medium, High)
- each category includes default: Ping, nslookup, whois (if available)
- lets you choose commands from a selected category and run them
- optionally save output to a file

WARNING: This script runs commands via shell and is meant for interactive use.
Only scan/query hosts you own or have explicit permission to test.
"""

import shutil
import subprocess
import sys
import shlex

# Helper to safely quote target for shell insertion
def q(s: str) -> str:
    return shlex.quote(s)

# Core categorized nmap commands (without the basic tools)
CORE_PREDEFINED = {
    "Low": [
        ("Quick SYN + version (fast, light)", "nmap -sS -sV --top-ports 50 {target}"),
        ("Service banner grab (single-port common)", "nmap -p 22,80,443 -sV --open {target}"),
    ],
    "Medium": [
        ("Top 100 TCP ports (moderate)", "nmap --top-ports 100 -sS -sV {target}"),
        ("UDP top ports (slightly noisy, slower)", "nmap --top-ports 100 -sU {target}"),
        ("OS detection + version (more intrusive)", "nmap -O -sV {target}"),
        ("Full TCP port scan (all ports, slower)", "nmap -p- -sS -sV -T3 {target}"),
    ],
    "High": [
        ("Run 'vuln' NSE category (aggressive, intrusive)", "nmap --script vuln {target}"),
        ("Aggressive + scripts (OS, version, default scripts)", "nmap -A --script=default {target}"),
        ("Full scan + vuln scripts (very noisy & slow)", "nmap -p- -sS -sV --script vuln -T2 {target}"),
    ],
}

# Names of the basic tools to include in every category (label, template)
BASIC_TOOLS = [
    ("Ping (4 ICMP packets)", "ping -c 4 {target}"),
    ("nslookup (DNS lookup)", "nslookup {target}"),
    ("whois (domain registration info)", "whois {target}"),
]

# Build the final PREDEFINED_BY_INTENSITY by inserting BASIC_TOOLS at the top of each category
PREDEFINED_BY_INTENSITY = {}
for cat, items in CORE_PREDEFINED.items():
    PREDEFINED_BY_INTENSITY[cat] = BASIC_TOOLS + items

def find_cmd(cmd_name: str) -> bool:
    """Return True if cmd is available in PATH."""
    return shutil.which(cmd_name) is not None

def find_nmap():
    n = shutil.which("nmap")
    if not n:
        print("Warning: nmap not found in PATH. Nmap commands will fail unless you install nmap.", file=sys.stderr)
    return n

def show_categories():
    print("\nIntensity categories:")
    for i, cat in enumerate(PREDEFINED_BY_INTENSITY.keys(), start=1):
        print(f"  {i}) {cat}")
    print("  0) Exit")

def show_category_commands(category):
    items = PREDEFINED_BY_INTENSITY[category]
    print(f"\nCommands in '{category}' category:")
    for i, (label, cmd) in enumerate(items, start=1):
        # Show the command but replace {target} w/ <target> for clarity
        preview = cmd.replace("{target}", "<target>")
        print(f"  {i}) {label}  ->  {preview}")
    print("  0) Back")

def run_command(cmd):
    print("\n--- Running ---")
    print(cmd)
    print("---------------\n")
    proc = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.stdout:
        print(proc.stdout)
    if proc.stderr:
        print("STDERR:", proc.stderr, file=sys.stderr)
    print(f"\n[return code: {proc.returncode}]\n")
    return proc.returncode

def main():
    # Warn if basic utilities missing
    missing_tools = []
    for t in ("ping", "nslookup", "whois"):
        if not find_cmd(t):
            missing_tools.append(t)
    if missing_tools:
        print("Note: the following commands are not present in PATH and their menu entries may fail:", ", ".join(missing_tools), file=sys.stderr)
        print("Install them or ignore those menu options if you don't need them.\n", file=sys.stderr)

    find_nmap()  # warns if nmap missing, but continue

    target = input("Enter hostname or IP (or CIDR): ").strip()
    if not target:
        print("No target provided. Exiting.")
        return

    while True:
        show_categories()
        cat_choice = input("Choose a category number (or 0 to exit): ").strip()
        if not cat_choice.isdigit():
            print("Invalid input; enter a number.")
            continue
        cat_choice = int(cat_choice)
        if cat_choice == 0:
            print("Bye.")
            break

        cats = list(PREDEFINED_BY_INTENSITY.keys())
        if not (1 <= cat_choice <= len(cats)):
            print("Choice out of range.")
            continue

        category = cats[cat_choice - 1]
        while True:
            show_category_commands(category)
            cmd_choice = input("Choose command number (or comma-separated list) or 0 to go back: ").strip()
            if cmd_choice == "0":
                break
            # parse choices
            choices = [c.strip() for c in cmd_choice.split(",") if c.strip().isdigit()]
            if not choices:
                print("Invalid choice. Try again.")
                continue
            for ch in choices:
                idx = int(ch) - 1
                items = PREDEFINED_BY_INTENSITY[category]
                if idx < 0 or idx >= len(items):
                    print(f"Choice {ch} out of range, skipping.")
                    continue
                label, template = items[idx]
                cmd = template.format(target=q(target))

                # Ask whether to save output (only for commands that support -oN or where user wants raw redirection)
                save = input("Save output to file? (y/N): ").strip().lower()
                if save == "y":
                    fname = input("Enter filename (e.g. result.txt): ").strip()
                    if fname:
                        qfname = q(fname)
                        # For nmap specifically prefer -oN, else redirect stdout
                        if template.startswith("nmap"):
                            # append -oN so nmap writes normal output to file
                            cmd = f"{cmd} -oN {qfname}"
                        else:
                            # Redirect stdout to file for non-nmap tools
                            cmd = f"{cmd} > {qfname} 2>&1"

                run_command(cmd)

            more = input("Run more commands in this category? (Y/n): ").strip().lower()
            if more == "n":
                break

        cont = input("Choose another category or exit? (Y/n): ").strip().lower()
        if cont == "n":
            print("Done.")
            break

if __name__ == "__main__":
    main()
