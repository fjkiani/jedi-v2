
"""
Jedi Labs - Agent Deployment Sync
Iterates through the manifest and ensures all Agents are deployed to Hygraph.
"""
from hygraph_manager import HygraphManager
from jedi_agents_manifest import AGENTS

def main():
    print("🤖 Initializing Jedi Labs Deployment Sync...")
    
    try:
        manager = HygraphManager()
    except Exception as e:
        print(f"❌ Initialization Failed: {e}")
        return

    print(f"📋 Found {len(AGENTS)} Agents in manifest.")
    
    for agent in AGENTS:
        print(f"\n--- Processing: {agent['title']} ---")
        manager.create_or_update_agent(agent)
    
    print("\n✅ Sync Complete.")

if __name__ == "__main__":
    main()
