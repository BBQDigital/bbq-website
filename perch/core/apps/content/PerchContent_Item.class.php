<?php

class PerchContent_Item extends PerchBase
{
    protected $table  = 'content_items';
    protected $pk     = 'itemRowID';

    public function delete()
    {
    	$sql = 'DELETE FROM '.PERCH_DB_PREFIX.'content_index WHERE itemID='.$this->db->pdb($this->id());
    	$this->db->execute($sql);

        $Perch = Perch::fetch();
        $Perch->event('item.delete', $this);

    	parent::delete();
    }


	public function clear_resources()
	{
        $sql = 'DELETE FROM '.PERCH_DB_PREFIX.'resource_log WHERE appID='.$this->db->pdb('content').' AND itemFK='.$this->db->pdb('itemRowID').' AND itemRowID='.$this->db->pdb($this->itemRowID());
		$this->db->execute($sql);

        $Perch = Perch::fetch();
        $Perch->event('item.clear_resources', $this);
	}

    public function log_resources($resourceIDs)
    {
    	if (PerchUtil::count($resourceIDs)) {
    		$sql = 'INSERT INTO '.PERCH_DB_PREFIX.'resource_log(`appID`, `itemFK`, `itemRowID`, `resourceID`) VALUES';
    		
    		$vals = array();

    		foreach($resourceIDs as $id) {
    			$vals[] = '('."'content','itemRowID',".(int)$this->itemRowID().','.(int)$id.')';
    		}

    		$sql .= implode(',', $vals);

    		$this->db->execute($sql);

            $Perch = Perch::fetch();
            $Perch->event('item.clear_resources', $this);
    	}
    }

}
